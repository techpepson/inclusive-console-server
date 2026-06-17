import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResourcesService } from './resources.service';
import { ResourceDto } from '../dto/resource.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get('all')
  async getAllResources() {
    return this.resourcesService.getAllResources();
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  async createResource(
    @Body() dto: ResourceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.resourcesService.createResource(dto, file);
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteResource(@Query('id') id: string) {
    return this.resourcesService.deleteResource(id);
  }
}
