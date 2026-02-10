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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SocialDto } from '../dto/socials.dto';
import { SocialsService } from './socials.service';

@Controller('socials')
export class SocialsController {
  constructor(private readonly socialsService: SocialsService) {}

  // Public: get all social handles
  @Get('/all')
  async getAllSocials() {
    return this.socialsService.getAllSocials();
  }

  // Public: get a single social handle
  @Get('/get-by-id')
  async getSocialById(@Query('id') id: string) {
    return this.socialsService.getSocialById(id);
  }

  // Admin: create social handle
  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createSocial(@Body() dto: SocialDto) {
    return this.socialsService.createSocial(dto);
  }

  // Admin: update social handle
  @Patch('/update')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateSocial(@Query('id') id: string, @Body() dto: SocialDto) {
    return this.socialsService.updateSocial(id, dto);
  }

  // Admin: delete social handle
  @Delete('/delete')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteSocial(@Query('id') id: string) {
    return this.socialsService.deleteSocial(id);
  }
}
