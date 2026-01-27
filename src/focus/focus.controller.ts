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
import { FocusService } from './focus.service';
import { FocusDto } from '../dto/focus.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('focus')
export class FocusController {
  constructor(private readonly focusService: FocusService) {}

  @Get('all')
  async getAllFocusAreas() {
    return this.focusService.getAllFocusAreas();
  }

  @Get('single')
  async getFocusAreaById(@Query('id') id: string) {
    return this.focusService.getFocusAreaById(id);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 10))
  @HttpCode(HttpStatus.CREATED)
  async createFocusArea(
    @Body() dto: FocusDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.focusService.createFocusArea(dto, images);
  }

  @Patch('update')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('images', 10))
  @HttpCode(HttpStatus.OK)
  async updateFocusArea(
    @Query('id') id: string,
    @Body() dto: FocusDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    return this.focusService.updateFocusArea(id, dto, images);
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteFocusArea(@Query('id') id: string) {
    return this.focusService.deleteFocusArea(id);
  }
}
