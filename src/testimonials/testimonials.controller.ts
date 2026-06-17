import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
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

  @Get('all-admin')
  @UseGuards(JwtAuthGuard)
  async getAllTestimonialsAdmin() {
    return this.testimonialsService.getAllTestimonialsAdmin();
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

  @Post('submit')
  @HttpCode(HttpStatus.CREATED)
  async submitTestimonial(@Body() dto: TestimonialDto) {
    return this.testimonialsService.submitTestimonial(dto);
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

  @Patch('approve')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async approveTestimonial(@Query('id') id: string) {
    return this.testimonialsService.approveTestimonial(id);
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteTestimonial(@Query('id') id: string) {
    return this.testimonialsService.deleteTestimonial(id);
  }
}
