import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { EventService } from './events.service';
import { EventDto, CreateEventsDto } from '../dto/event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventService) {}

  @Get('all')
  async getAllEvents() {
    return this.eventService.getAllEvents();
  }

  @Get('single')
  async getEventById(@Query('id') id: string) {
    return this.eventService.getEventById(id);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 10))
  @HttpCode(HttpStatus.CREATED)
  async createEvent(
    @Body() dto: EventDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    return this.eventService.createEvent(dto, images);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createMultipleEvents(@Body() dto: CreateEventsDto) {
    return this.eventService.createMultipleEvents(dto.events);
  }

  @Patch('update')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('images', 10))
  @HttpCode(HttpStatus.OK)
  async updateEvent(
    @Query('id') id: string,
    @Body() dto: EventDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    return this.eventService.updateEvent(id, dto, images);
  }

  @Delete('event')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async deleteEvent(@Query('id') id: string) {
    return this.eventService.deleteEvent(id);
  }
}
