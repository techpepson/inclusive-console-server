import { MetricsService } from './metrics.service';
import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [AuthModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [MetricsController],
  providers: [MetricsService, PrismaService],
})
export class MetricsModule {}
