import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContactDto } from '../dto/contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async createContactMessage(dto: ContactDto) {
    if (!dto?.name || !dto?.email || !dto?.message) {
      throw new BadRequestException('Missing required contact fields');
    }

    return this.prisma.contactMessage.create({
      data: {
        name: dto.name,
        email: dto.email,
        subject: dto.subject ?? null,
        phone: dto.phone ?? null,
        message: dto.message,
      },
    });
  }

  async getAllContactMessages() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getContactMessageById(id: string) {
    if (!id) {
      throw new BadRequestException('id is required');
    }

    const message = await this.prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException('Contact message not found');
    }

    return message;
  }

  async deleteContactMessage(id: string) {
    if (!id) {
      throw new BadRequestException('id is required');
    }

    const existing = await this.prisma.contactMessage.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Contact message not found');
    }

    return this.prisma.contactMessage.delete({ where: { id } });
  }
}
