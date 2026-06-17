import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HelpersService } from '../helpers/helpers.service';
import { ResourceDto } from '../dto/resource.dto';

@Injectable()
export class ResourcesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helpers: HelpersService,
  ) {}

  async createResource(dto: ResourceDto, file?: Express.Multer.File) {
    if (!dto?.title || !dto?.description || !dto?.type) {
      throw new BadRequestException('Title, description, and type are required');
    }

    let url = '';

    if (file) {
      const uploadResult = await this.helpers.uploadFile(
        file,
        dto.title,
        dto.type.toLowerCase(),
      );
      url = uploadResult.publicUrl || '';
    } else {
      throw new BadRequestException('A file is required to create a resource');
    }

    return this.prisma.resource.create({
      data: {
        title: dto.title,
        description: dto.description,
        type: dto.type.toUpperCase(),
        url: url,
      },
    });
  }

  async getAllResources() {
    return this.prisma.resource.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteResource(id: string) {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
    });

    if (!resource) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }

    // Optional: We could delete it from Supabase as well, but standard DB delete is required.
    return this.prisma.resource.delete({
      where: { id },
    });
  }
}
