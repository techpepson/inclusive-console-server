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
    // Upload profile pictures if provided
    const profilePictureUrls: { [key: number]: string } = {};
    if (profilePictureFiles && profilePictureFiles.length > 0) {
      for (let i = 0; i < profilePictureFiles.length; i++) {
        const file = profilePictureFiles[i];
        const memberName = dto.teamMembers?.[i]?.name || `Member ${i + 1}`;
        const uploaded = await this.helpers.uploadImage(
          file,
          memberName,
          'team-member',
        );
        profilePictureUrls[i] = uploaded.publicUrl || '';
      }
    }

    // Find or create About record first
    let about = await this.prisma.about.findFirst();
    if (!about) {
      about = await this.prisma.about.create({
        data: {
          description: dto.about?.description || '',
          missionDescription: dto.about?.missionDescription || '',
          visionDescription: dto.about?.visionDescription || '',
        },
      });
    }

    // Update About if data provided
    if (dto.about) {
      about = await this.prisma.about.update({
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

    // Clear existing relations before creating new ones
    if (dto.teamMembers && dto.teamMembers.length > 0) {
      await this.prisma.teamMember.deleteMany({
        where: { aboutId: about.id },
      });
    }
    if (dto.sponsors && dto.sponsors.length > 0) {
      await this.prisma.sponsor.deleteMany({
        where: { aboutId: about.id },
      });
    }

    // Create team members with about relation
    const createdTeamMembers: any[] = [];
    if (dto.teamMembers && dto.teamMembers.length > 0) {
      for (let i = 0; i < dto.teamMembers.length; i++) {
        const member = dto.teamMembers[i];
        const created = await this.prisma.teamMember.create({
          data: {
            name: member.name,
            role: member.role,
            description: member.description,
            profilePicture: profilePictureUrls[i] || null,
            aboutId: about.id,
          },
        });
        createdTeamMembers.push(created);
      }
    }

    // Create sponsors with about relation
    const createdSponsors: any[] = [];
    if (dto.sponsors && dto.sponsors.length > 0) {
      for (const sponsor of dto.sponsors) {
        if (!sponsor?.name) {
          throw new BadRequestException('Each sponsor must have a name');
        }
        const created = await this.prisma.sponsor.create({
          data: {
            name: sponsor.name,
            description: sponsor.description || null,
            website: sponsor.website || null,
            aboutId: about.id,
          },
        });
        createdSponsors.push(created);
      }
    }

    return {
      about,
      teamMembers: createdTeamMembers,
      sponsors: createdSponsors,
    };
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
