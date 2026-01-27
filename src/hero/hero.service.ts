import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HeroDto } from '../dto/hero.dto';

@Injectable()
export class HeroService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertHeroContent(dto: HeroDto, userId: string) {
    const latest = await this.prisma.hero.findFirst({
      orderBy: { updatedAt: 'desc' },
      select: { id: true },
    });

    if (latest) {
      return this.prisma.hero.update({
        where: { id: latest.id },
        data: {
          heading: dto.title,
          subTitle: dto.subTitle,
          primaryButtonText: dto.primaryButtonText,
          secondaryButtonText: dto.secondaryButtonText,
          updatedAt: new Date(),
        },
      });
    }

    return this.prisma.hero.create({
      data: {
        heading: dto.title,
        subTitle: dto.subTitle,
        primaryButtonText: dto.primaryButtonText,
        secondaryButtonText: dto.secondaryButtonText,
        createdBy: { connect: { id: userId } },
      },
    });
  }

  async getHeroContent() {
    return this.prisma.hero.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
