import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventDto } from '../dto/event.dto';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async createMultipleEvents(events: EventDto[]) {
    if (!Array.isArray(events) || events.length === 0) {
      throw new BadRequestException(
        'Events array is required and cannot be empty',
      );
    }

    const validated = events.map((event) => {
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
      return {
        title: event.title,
        description: event.description,
        date: new Date(event.date),
        location: event.location,
      };
    });

    await this.prisma.events.createMany({
      data: validated,
      skipDuplicates: false,
    });

    return {
      message: `${validated.length} events created successfully`,
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

  async updateEvent(id: string, dto: EventDto) {
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

    return this.prisma.events.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        date: new Date(dto.date),
        location: dto.location,
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
