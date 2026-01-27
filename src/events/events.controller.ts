import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
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

  @Post('bulk')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createMultipleEvents(@Body() dto: CreateEventsDto) {
    return this.eventService.createMultipleEvents(dto.events);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async updateEvent(@Query('id') id: string, @Body() dto: EventDto) {
    return this.eventService.updateEvent(id, dto);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async deleteEvent(@Query('id') id: string) {
    return this.eventService.deleteEvent(id);
  }
}
