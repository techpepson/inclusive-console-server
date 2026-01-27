import { TestimonialsService } from './testimonials.service';
import { Module } from '@nestjs/common';
import { TestimonialsController } from './testimonials.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [AuthModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [TestimonialsController],
  providers: [TestimonialsService, PrismaService],
})
export class TestimonialsModule {}
