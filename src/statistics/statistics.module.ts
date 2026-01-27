import { HelpersService } from '../helpers/helpers.service';
import { PrismaService } from '../prisma/prisma.service';
import { StatisticsService } from './statistics.service';
import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [AuthModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [StatisticsController],
  providers: [StatisticsService, PrismaService, HelpersService],
})
export class StatisticsModule {}
