import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HelpersService } from '../helpers/helpers.service';
import { TeamMemberDto, SponsorDto, CompleteAboutDto } from '../dto/about.dto';

@Injectable()
export class AboutService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helpers: HelpersService,
  ) {}

  // Unified endpoint to handle complete about data with nested creates
  async upsertCompleteAbout(
    dto: CompleteAboutDto,
    profilePictureFiles?: Express.Multer.File[],
  ) {
    const teamMembersInput = dto.teamMembers ?? [];
    const sponsorsInput = dto.sponsors ?? [];

    // IMPORTANT: Never perform network I/O inside a DB transaction.
    // Uploading to Supabase can take seconds and will hold a DB connection,
    // causing transaction start timeouts (Prisma P2028) under concurrency.
    const uploadedProfilePictureUrls: Record<number, string> = {};
    const usedUploadIndexes = new Set<number>();
    for (const member of teamMembersInput) {
      const idx = member.profilePictureUploadIndex;
      if (idx === undefined || idx === null) continue;
      if (!Number.isInteger(idx) || idx < 0) {
        throw new BadRequestException(
          'profilePictureUploadIndex must be a non-negative integer',
        );
      }
      if (!profilePictureFiles || idx >= profilePictureFiles.length) {
        throw new BadRequestException(
          `No file found at profilePictures[${idx}]`,
        );
      }
      usedUploadIndexes.add(idx);
    }

    for (const idx of usedUploadIndexes) {
      const file = profilePictureFiles?.[idx];
      if (!file) continue;
      const memberName =
        teamMembersInput.find((m) => m.profilePictureUploadIndex === idx)
          ?.name || `Member ${idx + 1}`;
      const uploaded = await this.helpers.uploadImage(
        file,
        memberName,
        'team-member',
      );
      uploadedProfilePictureUrls[idx] = uploaded.publicUrl || '';
    }

    return this.prisma.$transaction(
      async (tx) => {
        // Find or create About record first (schema requires non-null strings)
        let about = await tx.about.findFirst();
        if (!about) {
          about = await tx.about.create({
            data: {
              description: dto.about?.description || '',
              missionDescription: dto.about?.missionDescription || '',
              visionDescription: dto.about?.visionDescription || '',
            },
          });
        }

        // Update About if provided (partial update)
        if (dto.about) {
          about = await tx.about.update({
            where: { id: about.id },
            data: {
              description: dto.about.description ?? about.description,
              missionDescription:
                dto.about.missionDescription ?? about.missionDescription,
              visionDescription:
                dto.about.visionDescription ?? about.visionDescription,
            },
          });
        }

        // Clear-all operations
        if (dto.clearTeamMembers === true) {
          await tx.teamMember.deleteMany({ where: { aboutId: about.id } });
        }
        if (dto.clearSponsors === true) {
          await tx.sponsor.deleteMany({ where: { aboutId: about.id } });
        }

        // Targeted deletes (ignored when clearAll is true)
        if (
          dto.clearTeamMembers !== true &&
          Array.isArray(dto.deleteTeamMemberIds) &&
          dto.deleteTeamMemberIds.length > 0
        ) {
          await tx.teamMember.deleteMany({
            where: {
              id: { in: dto.deleteTeamMemberIds },
              aboutId: about.id,
            },
          });
        }
        if (
          dto.clearSponsors !== true &&
          Array.isArray(dto.deleteSponsorIds) &&
          dto.deleteSponsorIds.length > 0
        ) {
          await tx.sponsor.deleteMany({
            where: {
              id: { in: dto.deleteSponsorIds },
              aboutId: about.id,
            },
          });
        }

        // Upsert Team Members (create/update) and always link to this About
        for (const member of teamMembersInput) {
          if (!member?.name || !member?.role || !member?.description) {
            throw new BadRequestException(
              'Each team member must have name, role, and description',
            );
          }

          const uploadedUrl =
            member.profilePictureUploadIndex !== undefined &&
            member.profilePictureUploadIndex !== null
              ? uploadedProfilePictureUrls[member.profilePictureUploadIndex]
              : undefined;

          if (member.id) {
            const existing = await tx.teamMember.findUnique({
              where: { id: member.id },
            });
            if (!existing) {
              throw new NotFoundException(
                `Team member with id ${member.id} not found`,
              );
            }

            await tx.teamMember.update({
              where: { id: member.id },
              data: {
                name: member.name,
                role: member.role,
                description: member.description,
                profilePicture:
                  uploadedUrl !== undefined
                    ? uploadedUrl || null
                    : (member.profilePicture ?? existing.profilePicture),
                aboutId: about.id,
              },
            });
          } else {
            await tx.teamMember.create({
              data: {
                name: member.name,
                role: member.role,
                description: member.description,
                profilePicture:
                  uploadedUrl !== undefined
                    ? uploadedUrl || null
                    : (member.profilePicture ?? null),
                aboutId: about.id,
              },
            });
          }
        }

        // Upsert Sponsors (create/update) and always link to this About
        for (const sponsor of sponsorsInput) {
          if (!sponsor?.name) {
            throw new BadRequestException('Each sponsor must have a name');
          }

          if (sponsor.id) {
            const existing = await tx.sponsor.findUnique({
              where: { id: sponsor.id },
            });
            if (!existing) {
              throw new NotFoundException(
                `Sponsor with id ${sponsor.id} not found`,
              );
            }

            await tx.sponsor.update({
              where: { id: sponsor.id },
              data: {
                name: sponsor.name,
                description: sponsor.description ?? existing.description,
                website: sponsor.website ?? existing.website,
                aboutId: about.id,
              },
            });
          } else {
            await tx.sponsor.create({
              data: {
                name: sponsor.name,
                description: sponsor.description || null,
                website: sponsor.website || null,
                aboutId: about.id,
              },
            });
          }
        }

        // Return the current state after mutations
        const teamMembers = await tx.teamMember.findMany({
          where: { aboutId: about.id },
          orderBy: { createdAt: 'desc' },
        });

        const sponsors = await tx.sponsor.findMany({
          where: { aboutId: about.id },
          orderBy: { createdAt: 'desc' },
        });

        return { about, teamMembers, sponsors };
      },
      // Give the pool a bit more time to acquire a connection under load.
      { maxWait: 10_000, timeout: 60_000 },
    );
  }

  async getAbout() {
    const about = await this.prisma.about.findFirst();
    if (!about) {
      throw new NotFoundException('About section not found');
    }
    return about;
  }

  // Team Members
  async createTeamMember(
    dto: TeamMemberDto,
    profilePictureFile?: Express.Multer.File,
  ) {
    if (!dto?.name || !dto?.role || !dto?.description) {
      throw new BadRequestException('Name, role, and description are required');
    }

    let profilePictureUrl: string | null = null;
    if (profilePictureFile) {
      const uploaded = await this.helpers.uploadImage(
        profilePictureFile,
        dto.name,
        'team-member',
      );
      profilePictureUrl = uploaded.publicUrl || null;
    }

    return this.prisma.teamMember.create({
      data: {
        name: dto.name,
        role: dto.role,
        description: dto.description,
        profilePicture: profilePictureUrl,
      },
    });
  }

  async createMultipleTeamMembers(
    teamMembers: TeamMemberDto[],
    profilePictureFiles?: Express.Multer.File[],
  ) {
    if (!Array.isArray(teamMembers) || teamMembers.length === 0) {
      throw new BadRequestException(
        'Team members array is required and cannot be empty',
      );
    }

    const results: any[] = [];
    for (let i = 0; i < teamMembers.length; i++) {
      const member = teamMembers[i];
      const file = profilePictureFiles?.[i];
      const created = await this.createTeamMember(member, file);
      results.push(created);
    }

    return results;
  }

  async getAllTeamMembers() {
    return this.prisma.teamMember.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTeamMemberById(id: string) {
    const member = await this.prisma.teamMember.findUnique({
      where: { id },
    });

    if (!member) {
      throw new NotFoundException(`Team member with id ${id} not found`);
    }

    return member;
  }

  async updateTeamMember(
    id: string,
    dto: TeamMemberDto,
    profilePictureFile?: Express.Multer.File,
  ) {
    if (!dto?.name || !dto?.role || !dto?.description) {
      throw new BadRequestException('Name, role, and description are required');
    }

    const member = await this.prisma.teamMember.findUnique({
      where: { id },
    });

    if (!member) {
      throw new NotFoundException(`Team member with id ${id} not found`);
    }

    let profilePictureUrl = member.profilePicture;
    if (profilePictureFile) {
      const uploaded = await this.helpers.uploadImage(
        profilePictureFile,
        dto.name,
        'team-member',
      );
      profilePictureUrl = uploaded.publicUrl || null;
    }

    return this.prisma.teamMember.update({
      where: { id },
      data: {
        name: dto.name,
        role: dto.role,
        description: dto.description,
        profilePicture: profilePictureUrl,
      },
    });
  }

  async deleteTeamMember(id: string) {
    const member = await this.prisma.teamMember.findUnique({
      where: { id },
    });

    if (!member) {
      throw new NotFoundException(`Team member with id ${id} not found`);
    }

    return this.prisma.teamMember.delete({
      where: { id },
    });
  }

  // Sponsors
  async createSponsor(dto: SponsorDto) {
    if (!dto?.name) {
      throw new BadRequestException('Sponsor name is required');
    }

    return this.prisma.sponsor.create({
      data: {
        name: dto.name,
        description: dto.description || null,
        website: dto.website || null,
      },
    });
  }

  async getAllSponsors() {
    return this.prisma.sponsor.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSponsorById(id: string) {
    const sponsor = await this.prisma.sponsor.findUnique({
      where: { id },
    });

    if (!sponsor) {
      throw new NotFoundException(`Sponsor with id ${id} not found`);
    }

    return sponsor;
  }

  async updateSponsor(id: string, dto: SponsorDto) {
    if (!dto?.name) {
      throw new BadRequestException('Sponsor name is required');
    }

    const sponsor = await this.prisma.sponsor.findUnique({
      where: { id },
    });

    if (!sponsor) {
      throw new NotFoundException(`Sponsor with id ${id} not found`);
    }

    return this.prisma.sponsor.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description || null,
        website: dto.website || null,
      },
    });
  }

  async deleteSponsor(id: string) {
    const sponsor = await this.prisma.sponsor.findUnique({
      where: { id },
    });

    if (!sponsor) {
      throw new NotFoundException(`Sponsor with id ${id} not found`);
    }

    return this.prisma.sponsor.delete({
      where: { id },
    });
  }
}
