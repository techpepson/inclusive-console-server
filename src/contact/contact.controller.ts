import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactDto } from '../dto/contact.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // Public: client sends contact messages
  @Post('/send')
  async createContactMessage(@Body() dto: ContactDto) {
    return this.contactService.createContactMessage(dto);
  }

  // Admin: fetch all contact messages
  @Get('/all')
  @UseGuards(JwtAuthGuard)
  async getAllContactMessages() {
    return this.contactService.getAllContactMessages();
  }

  // Admin: fetch a single contact message
  @Get('/get-by-id')
  @UseGuards(JwtAuthGuard)
  async getContactMessageById(@Query('id') id: string) {
    return await this.contactService.getContactMessageById(id);
  }

  // Admin: delete a contact message
  @Delete('/delete')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteContactMessage(@Query('id') id: string) {
    return this.contactService.deleteContactMessage(id);
  }
}
