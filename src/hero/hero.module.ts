import { PrismaService } from '../prisma/prisma.service';
import { HeroService } from './hero.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [HeroService, PrismaService],
})
export class HeroModule {}
