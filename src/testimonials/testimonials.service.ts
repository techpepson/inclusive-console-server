import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TestimonialDto } from '../dto/testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(private readonly prisma: PrismaService) {}

  async createTestimonial(dto: TestimonialDto) {
    if (!dto?.speaker || !dto?.role || !dto?.statement) {
      throw new BadRequestException(
        'Speaker, role, and statement are required',
      );
    }

    return this.prisma.testimonial.create({
      data: {
        speaker: dto.speaker,
        role: dto.role,
        statement: dto.statement,
      },
      select: {
        id: true,
        speaker: true,
        role: true,
        statement: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async createMultipleTestimonials(testimonials: TestimonialDto[]) {
    if (!Array.isArray(testimonials) || testimonials.length === 0) {
      throw new BadRequestException(
        'Testimonials array is required and cannot be empty',
      );
    }

    const validated = testimonials.map((testimonial) => {
      if (
        !testimonial?.speaker ||
        !testimonial?.role ||
        !testimonial?.statement
      ) {
        throw new BadRequestException(
          'Each testimonial must have speaker, role, and statement',
        );
      }
      return {
        speaker: testimonial.speaker,
        role: testimonial.role,
        statement: testimonial.statement,
      };
    });

    await this.prisma.testimonial.createMany({
      data: validated,
      skipDuplicates: false,
    });

    return {
      message: `${validated.length} testimonials created successfully`,
    };
  }

  async getAllTestimonials() {
    return this.prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        speaker: true,
        role: true,
        statement: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getTestimonialById(id: string) {
    const testimonial = await this.prisma.testimonial.findUnique({
      where: { id },
      select: {
        id: true,
        speaker: true,
        role: true,
        statement: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!testimonial) {
      throw new NotFoundException(`Testimonial with id ${id} not found`);
    }

    return testimonial;
  }

  async updateTestimonial(id: string, dto: TestimonialDto) {
    if (!dto?.speaker || !dto?.role || !dto?.statement) {
      throw new BadRequestException(
        'Speaker, role, and statement are required',
      );
    }

    const testimonial = await this.prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      throw new NotFoundException(`Testimonial with id ${id} not found`);
    }

    return this.prisma.testimonial.update({
      where: { id },
      data: {
        speaker: dto.speaker,
        role: dto.role,
        statement: dto.statement,
      },
      select: {
        id: true,
        speaker: true,
        role: true,
        statement: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteTestimonial(id: string) {
    const testimonial = await this.prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      throw new NotFoundException(`Testimonial with id ${id} not found`);
    }

    return this.prisma.testimonial.delete({
      where: { id },
      select: {
        id: true,
        speaker: true,
        role: true,
        statement: true,
      },
    });
  }
}
