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
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { CreateImpactMetricsDto, ImpactMetricDto } from '../dto/metric.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('get-all')
  async getAllMetrics() {
    return this.metricsService.getAllImpactMetrics();
  }

  @Get('single')
  async getMetricById(@Query('id') id: string) {
    return this.metricsService.getImpactMetricById(id);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createMetric(@Body() dto: ImpactMetricDto, @Req() req: any) {
    const userId = req?.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User context is required');
    }
    return this.metricsService.createImpactMetric(dto, userId);
  }

  //use this in production with caution
  @Post('bulk')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createMultipleMetrics(
    @Body() dto: CreateImpactMetricsDto,
    @Req() req: any,
  ) {
    const userId = req?.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User context is required');
    }
    return this.metricsService.createMultipleImpactMetrics(dto.metrics, userId);
  }

  @Patch('update')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateMetric(@Query('id') id: string, @Body() dto: ImpactMetricDto) {
    return this.metricsService.updateImpactMetric(id, dto);
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteMetric(@Query('id') id: string) {
    return this.metricsService.deleteImpactMetric(id);
  }
}
