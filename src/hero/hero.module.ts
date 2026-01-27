import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { HeroController } from './hero.controller';
import { HeroService } from './hero.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [HeroController],
  providers: [HeroService, PrismaService],
})
export class HeroModule {}
