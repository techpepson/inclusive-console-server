import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HeroDto } from '../dto/hero.dto';
import { StatsDto } from '../dto/stats.dto';
import { MetricDto } from '../dto/metric.dto';
import { FocusDto } from '../dto/focus.dto';

@Injectable()
export class HeroService {
  constructor(private readonly prisma: PrismaService) {}

  logger = new Logger(HeroService.name);

  async addHero(payload: HeroDto) {
    try {
      const updatedHero = await this.prisma.hero.create({
        data: {
          mainTitle: payload.title,
          subTitle: payload.subTitle,
          primaryButtonText: payload.primaryButtonText,
          secoondaryButtonText: payload.secondaryButtonText,
        },
      });
      return updatedHero;
    } catch (error) {
      this.logger.error('Error in addHero:', error);
    }
  }

  async getHero() {
    const hero = await this.prisma.hero.findFirst();
    return {
      hero: hero ?? null,
    };
  }

  async updateStatistics(payload: StatsDto[]) {
    await Promise.all(
      payload.map(async (stat) => {
        await this.prisma.statistic.create({
          data: {
            label: stat.label,
            value: stat.value,
          },
        });
      }),
    );

    return {
      message: 'Statistics updated successfully',
    };
  }

  async getStatistics() {
    const statistics = await this.prisma.statistic.findMany();
    return {
      statistics: statistics ?? [],
    };
  }

  async updateMetrics(payload: MetricDto[]) {
    await Promise.all(
      payload.map(async (metric) => {
        await this.prisma.impactMetric.create({
          data: {
            label: metric.label,
            value: metric.value,
            growth: metric.growth,
          },
        });
      }),
    );
    return {
      message: 'Metrics updated successfully',
    };
  }

  async getMetrics() {
    const metrics = await this.prisma.impactMetric.findMany();
    return {
      metrics: metrics ?? [],
    };
  }

  async updateFocusAreas(payload: FocusDto[]) {
    await Promise.all(
      payload.map(async (area) => {
        await this.prisma.focusAreas.create({
          data: {
            label: area.label,
            image: area.image ?? '',
            hashTags: area.hashTags,
            description: area.description,
          },
        });
      }),
    );

    return {
      message: 'Focus areas updated successfully',
    };
  }

  async getFocusAreas() {
    const focusAreas = await this.prisma.focusAreas.findMany();
    return {
      focusAreas: focusAreas ?? [],
    };
  }
}
