import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SocialDto } from '../dto/socials.dto';

@Injectable()
export class SocialsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSocial(dto: SocialDto) {
    if (!dto?.platform || !dto?.url) {
      throw new BadRequestException('platform and url are required');
    }

    return await this.prisma.socials.create({
      data: {
        platform: dto.platform,
        url: dto.url,
      },
    });
  }

  async getAllSocials() {
    return await this.prisma.socials.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSocialById(id: string) {
    if (!id) {
      throw new BadRequestException('id is required');
    }

    const social = await this.prisma.socials.findUnique({
      where: { id },
    });

    if (!social) {
      throw new NotFoundException('Social handle not found');
    }

    return social;
  }

  async updateSocial(id: string, dto: SocialDto) {
    if (!id) {
      throw new BadRequestException('id is required');
    }

    const existing = await this.prisma.socials.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Social handle not found');
    }

    return this.prisma.socials.update({
      where: { id },
      data: {
        platform: dto.platform,
        url: dto.url,
      },
    });
  }

  async deleteSocial(id: string) {
    if (!id) {
      throw new BadRequestException('id is required');
    }

    const existing = await this.prisma.socials.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Social handle not found');
    }

    return this.prisma.socials.delete({ where: { id } });
  }
}
