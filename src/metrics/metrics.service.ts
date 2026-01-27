import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ImpactMetricDto } from '../dto/metric.dto';

@Injectable()
export class MetricsService {
  constructor(private readonly prisma: PrismaService) {}

  async createImpactMetric(dto: ImpactMetricDto, userId: string) {
    if (!dto?.label || !dto?.value) {
      throw new BadRequestException('Label and value are required');
    }

    return this.prisma.impactMetric.create({
      data: {
        label: dto.label,
        value: dto.value,
        createdBy: { connect: { id: userId } },
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

  async createMultipleImpactMetrics(
    metrics: ImpactMetricDto[],
    userId: string,
  ) {
    if (!Array.isArray(metrics) || metrics.length === 0) {
      throw new BadRequestException(
        'Metrics array is required and cannot be empty',
      );
    }

    const validated = metrics.map((metric) => {
      if (!metric?.label || !metric?.value) {
        throw new BadRequestException('Each metric must have label and value');
      }
      return {
        label: metric.label,
        value: metric.value,
        createdById: userId,
      };
    });

    const result = this.prisma.impactMetric.createMany({
      data: validated,
      skipDuplicates: false,
    });

    return {
      createdCount: (await result).count,
      message: `${(await result).count} impact metrics created successfully`,
    };
  }

  async getAllImpactMetrics() {
    return this.prisma.impactMetric.findMany({
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

  async getImpactMetricById(id: string) {
    const metric = await this.prisma.impactMetric.findUnique({
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

    if (!metric) {
      throw new NotFoundException(`Impact metric with id ${id} not found`);
    }

    return metric;
  }

  async updateImpactMetric(id: string, dto: ImpactMetricDto) {
    if (!dto?.label || !dto?.value) {
      throw new BadRequestException('Label and value are required');
    }

    const metric = await this.prisma.impactMetric.findUnique({
      where: { id },
      select: { createdById: true },
    });

    if (!metric) {
      throw new NotFoundException(`Impact metric with id ${id} not found`);
    }

    return this.prisma.impactMetric.update({
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

  async deleteImpactMetric(id: string) {
    const metric = await this.prisma.impactMetric.findUnique({
      where: { id },
    });

    if (!metric) {
      throw new NotFoundException(`Impact metric with id ${id} not found`);
    }

    return this.prisma.impactMetric.delete({
      where: { id },
      select: {
        id: true,
        label: true,
        value: true,
      },
    });
  }

  async getImpactMetricsByUser(userId: string) {
    return this.prisma.impactMetric.findMany({
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
