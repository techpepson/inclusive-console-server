import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { HeroService } from './hero.service';
import { HeroDto } from '../dto/hero.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Get('get-hero')
  async getHero() {
    return this.heroService.getHeroContent();
  }

  @Post('upsert-hero')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async upsertHero(@Body() dto: HeroDto, @Req() req: any) {
    const userId = req?.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User context is required');
    }
    return this.heroService.upsertHeroContent(dto, userId);
  }
}
