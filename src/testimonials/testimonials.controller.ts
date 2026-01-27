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
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialsDto, TestimonialDto } from '../dto/testimonial.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get('all')
  async getAllTestimonials() {
    return this.testimonialsService.getAllTestimonials();
  }

  @Get('single')
  async getTestimonialById(@Query('id') id: string) {
    return this.testimonialsService.getTestimonialById(id);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createTestimonial(@Body() dto: TestimonialDto) {
    return this.testimonialsService.createTestimonial(dto);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createMultipleTestimonials(@Body() dto: CreateTestimonialsDto) {
    return this.testimonialsService.createMultipleTestimonials(
      dto.testimonials,
    );
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateTestimonial(
    @Query('id') id: string,
    @Body() dto: TestimonialDto,
  ) {
    return this.testimonialsService.updateTestimonial(id, dto);
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteTestimonial(@Query('id') id: string) {
    return this.testimonialsService.deleteTestimonial(id);
  }
}
