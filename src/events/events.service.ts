import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HelpersService } from '../helpers/helpers.service';
import { EventDto } from '../dto/event.dto';

@Injectable()
export class EventService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helpers: HelpersService,
  ) {}

  async createEvent(dto: EventDto, images?: Express.Multer.File[]) {
    if (!dto?.title || !dto?.description || !dto?.date || !dto?.location) {
      throw new BadRequestException(
        'Title, description, date, and location are required',
      );
    }

    // Upload files to Supabase if provided, otherwise use URLs from DTO
    let imageUrls: string[] = dto.images ?? [];
    if (images && images.length > 0) {
      const uploadedImages = await this.helpers.uploadImages(
        images,
        dto.title,
        'event',
      );
      imageUrls = uploadedImages.map((img) => img.publicUrl || '');
    }

    return this.prisma.events.create({
      data: {
        title: dto.title,
        description: dto.description,
        date: new Date(dto.date),
        location: dto.location,
        images: imageUrls,
      },
    });
  }

  async createMultipleEvents(events: EventDto[]) {
    if (!Array.isArray(events) || events.length === 0) {
      throw new BadRequestException(
        'Events array is required and cannot be empty',
      );
    }

    // Upload files to Supabase if provided, otherwise use URLs from DTO
    const results: any[] = [];
    for (const event of events) {
      if (
        !event?.title ||
        !event?.description ||
        !event?.date ||
        !event?.location
      ) {
        throw new BadRequestException(
          'Each event must have title, description, date, and location',
        );
      }

      // Use DTO images (URL strings) or empty array
      const eventImages = event.images ?? [];

      const created = await this.prisma.events.create({
        data: {
          title: event.title,
          description: event.description,
          date: new Date(event.date),
          location: event.location,
          images: eventImages,
        },
      });
      results.push(created);
    }

    return {
      message: `${results.length} events created successfully`,
      events: results,
    };
  }

  getAllEvents() {
    return this.prisma.events.findMany({
      orderBy: { date: 'asc' },
    });
  }

  async getEventById(id: string) {
    const event = await this.prisma.events.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    return event;
  }

  async updateEvent(id: string, dto: EventDto, images?: Express.Multer.File[]) {
    if (!dto?.title || !dto?.description || !dto?.date || !dto?.location) {
      throw new BadRequestException(
        'Title, description, date, and location are required',
      );
    }

    const event = await this.prisma.events.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    // Upload new images if provided, otherwise keep existing or use DTO images
    let imageUrls = event.images;
    if (images && images.length > 0) {
      const uploadedImages = await this.helpers.uploadImages(
        images,
        dto.title,
        'event',
      );
      imageUrls = uploadedImages.map((img) => img.publicUrl || '');
    } else if (dto.images) {
      imageUrls = dto.images;
    }

    return this.prisma.events.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        date: new Date(dto.date),
        location: dto.location,
        images: imageUrls,
      },
    });
  }

  async deleteEvent(id: string) {
    const event = await this.prisma.events.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    return this.prisma.events.delete({
      where: { id },
    });
  }
}
