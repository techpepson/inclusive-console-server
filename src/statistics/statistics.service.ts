import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatisticDto } from '../dto/statistic.dto';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async createMultipleStatistics(statistics: StatisticDto[], userId: string) {
    if (!Array.isArray(statistics) || statistics.length === 0) {
      throw new BadRequestException(
        'Statistics array is required and cannot be empty',
      );
    }

    const validated = statistics.map((stat) => {
      if (!stat?.label || !stat?.value) {
        throw new BadRequestException(
          'Each statistic must have label and value',
        );
      }
      return {
        label: stat.label,
        value: stat.value,
        createdById: userId,
      };
    });

    return this.prisma.statistic.createMany({
      data: validated,
      skipDuplicates: false,
    });
  }

  async getAllStatistics() {
    return this.prisma.statistic.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        label: true,
        value: true,
        createdAt: true,
        updatedAt: true,
        createdBy: { select: { id: true, email: true, name: true } },
      },
    });
  }

  async getStatisticById(id: string) {
    const statistic = await this.prisma.statistic.findUnique({
      where: { id },
      select: {
        id: true,
        label: true,
        value: true,
        createdAt: true,
        updatedAt: true,
        createdBy: { select: { id: true, email: true, name: true } },
      },
    });

    if (!statistic) {
      throw new NotFoundException(`Statistic with id ${id} not found`);
    }

    return statistic;
  }

  async updateStatistic(id: string, dto: StatisticDto) {
    if (!dto?.label || !dto?.value) {
      throw new BadRequestException('Label and value are required');
    }

    const statistic = await this.prisma.statistic.findUnique({
      where: { id },
      select: { createdById: true },
    });

    if (!statistic) {
      throw new NotFoundException(`Statistic with id ${id} not found`);
    }

    return this.prisma.statistic.update({
      where: { id },
      data: {
        label: dto.label,
        value: dto.value,
      },
      select: {
        id: true,
        label: true,
        value: true,
        createdAt: true,
        updatedAt: true,
        createdBy: { select: { id: true, email: true } },
      },
    });
  }

  async deleteStatistic(id: string) {
    const statistic = await this.prisma.statistic.findUnique({
      where: { id },
    });

    if (!statistic) {
      throw new NotFoundException(`Statistic with id ${id} not found`);
    }

    return this.prisma.statistic.delete({
      where: { id },
      select: {
        id: true,
        label: true,
        value: true,
      },
    });
  }

  async getStatisticsByUser(userId: string) {
    return this.prisma.statistic.findMany({
      where: { createdById: userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        label: true,
        value: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
