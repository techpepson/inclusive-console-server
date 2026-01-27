import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HelpersService } from '../helpers/helpers.service';
import { FocusDto } from '../dto/focus.dto';

@Injectable()
export class FocusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helpers: HelpersService,
  ) {}

  async createFocusArea(dto: FocusDto, images: Express.Multer.File[]) {
    if (!dto?.title || !dto?.description || !dto?.hashTag) {
      throw new BadRequestException(
        'Title, description, and hashTag are required',
      );
    }

    const uploadedImages = await this.helpers.uploadImages(
      images || [],
      dto.title,
      'focus-area',
    );
    const imageUrls = uploadedImages.map((img) => img.publicUrl || '');

    return this.prisma.focusAreas.create({
      data: {
        title: dto.title,
        description: dto.description,
        hashTag: dto.hashTag,
        images: imageUrls,
        statsLabel: dto.statsLabel || '',
        statsValue: dto.statsValue || '',
        keyVoices: dto.keyVoices
          ? {
              create: dto.keyVoices.map((kv) => ({
                name: kv.name,
                description: kv.description,
                followers: kv.followers,
              })),
            }
          : undefined,
        inspiringStories: dto.inspiringStories
          ? {
              create: dto.inspiringStories.map((story) => ({
                speaker: story.speaker,
                story: story.story,
              })),
            }
          : undefined,
        supportingOrganizations: dto.supportingOrganizations
          ? {
              create: dto.supportingOrganizations.map((org) => ({
                name: org.name,
                description: org.description,
                email: org.email,
                website: org.website,
              })),
            }
          : undefined,
      },
      include: {
        keyVoices: true,
        inspiringStories: true,
        supportingOrganizations: true,
      },
    });
  }

  async createMultipleFocusAreas(
    focusAreas: { dto: FocusDto; images: Express.Multer.File[] }[],
  ) {
    if (!Array.isArray(focusAreas) || focusAreas.length === 0) {
      throw new BadRequestException(
        'Focus areas array is required and cannot be empty',
      );
    }

    const results: any[] = [];
    for (const { dto, images } of focusAreas) {
      const created = await this.createFocusArea(dto, images);
      results.push(created);
    }

    return results;
  }

  async getAllFocusAreas() {
    return this.prisma.focusAreas.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        keyVoices: true,
        inspiringStories: true,
        supportingOrganizations: true,
      },
    });
  }

  async getFocusAreaById(id: string) {
    const focusArea = await this.prisma.focusAreas.findUnique({
      where: { id },
      include: {
        keyVoices: true,
        inspiringStories: true,
        supportingOrganizations: true,
      },
    });

    if (!focusArea) {
      throw new NotFoundException(`Focus area with id ${id} not found`);
    }

    return focusArea;
  }

  async updateFocusArea(
    id: string,
    dto: FocusDto,
    images?: Express.Multer.File[],
  ) {
    const existing = await this.prisma.focusAreas.findUnique({
      where: { id },
      select: { id: true, images: true },
    });

    if (!existing) {
      throw new NotFoundException(`Focus area with id ${id} not found`);
    }

    let imageUrls = existing.images;
    if (images && images.length > 0) {
      const uploadedImages = await this.helpers.uploadImages(
        images,
        dto.title || 'focus',
        'focus-area',
      );
      imageUrls = uploadedImages.map((img) => img.publicUrl || '');
    }

    await this.prisma.keyVoice.deleteMany({ where: { focusAreaId: id } });
    await this.prisma.inspiringStories.deleteMany({
      where: { focusAreaId: id },
    });
    await this.prisma.supportingOrganization.deleteMany({
      where: { focusAreaId: id },
    });

    return this.prisma.focusAreas.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        hashTag: dto.hashTag,
        images: imageUrls,
        statsLabel: dto.statsLabel || '',
        statsValue: dto.statsValue || '',
        keyVoices: dto.keyVoices
          ? {
              create: dto.keyVoices.map((kv) => ({
                name: kv.name,
                description: kv.description,
                followers: kv.followers,
              })),
            }
          : undefined,
        inspiringStories: dto.inspiringStories
          ? {
              create: dto.inspiringStories.map((story) => ({
                speaker: story.speaker,
                story: story.story,
              })),
            }
          : undefined,
        supportingOrganizations: dto.supportingOrganizations
          ? {
              create: dto.supportingOrganizations.map((org) => ({
                name: org.name,
                description: org.description,
                email: org.email,
                website: org.website,
              })),
            }
          : undefined,
      },
      include: {
        keyVoices: true,
        inspiringStories: true,
        supportingOrganizations: true,
      },
    });
  }

  async deleteFocusArea(id: string) {
    const focusArea = await this.prisma.focusAreas.findUnique({
      where: { id },
    });

    if (!focusArea) {
      throw new NotFoundException(`Focus area with id ${id} not found`);
    }

    return this.prisma.focusAreas.delete({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
      },
    });
  }
}
