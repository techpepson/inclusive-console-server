import { Body, Controller, Get, Post } from '@nestjs/common';
import { HeroService } from './hero.service';
import { HeroDto } from '../dto/hero.dto';
import { StatsDto } from '../dto/stats.dto';
import { MetricDto } from '../dto/metric.dto';
import { FocusDto } from '../dto/focus.dto';

@Controller('admin')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Post('add-hero')
  async addHero(@Body() payload: HeroDto) {
    return this.heroService.addHero(payload);
  }

  @Get('get-hero')
  async getHero() {
    return this.heroService.getHero();
  }

  @Post('update-statistics')
  async updateStatistics(@Body() payload: StatsDto[]) {
    return this.heroService.updateStatistics(payload);
  }

  @Get('get-statistics')
  async getStatistics() {
    return this.heroService.getStatistics();
  }

  @Post('update-metrics')
  async updateMetrics(@Body() payload: MetricDto[]) {
    return this.heroService.updateMetrics(payload);
  }

  @Get('get-metrics')
  async getMetrics() {
    return this.heroService.getMetrics();
  }

  @Post('update-focus-areas')
  async updateFocusAreas(@Body() payload: FocusDto[]) {
    return this.heroService.updateFocusAreas(payload);
  }

  @Get('get-focus-areas')
  async getFocusAreas() {
    return this.heroService.getFocusAreas();
  }
}
