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
import { StatisticsService } from './statistics.service';
import { CreateStatisticsDto, StatisticDto } from '../dto/statistic.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('/all')
  async getAllStatistics() {
    return this.statisticsService.getAllStatistics();
  }

  @Get('/get-by-id')
  async getStatisticById(@Query('id') id: string) {
    return this.statisticsService.getStatisticById(id);
  }

  @Post('/bulk')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createMultipleStatistics(
    @Body() dto: CreateStatisticsDto,
    @Req() req: any,
  ) {
    const userId = req?.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User context is required');
    }
    return this.statisticsService.createMultipleStatistics(
      dto.statistics,
      userId,
    );
  }

  @Patch('/update')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateStatistic(@Query('id') id: string, @Body() dto: StatisticDto) {
    return this.statisticsService.updateStatistic(id, dto);
  }

  @Delete('/delete')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteStatistic(@Query('id') id: string) {
    return this.statisticsService.deleteStatistic(id);
  }
}
