import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { SocialsController } from './socials.controller';
import { SocialsService } from './socials.service';

@Module({
  imports: [AuthModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [SocialsController],
  providers: [SocialsService, PrismaService],
})
export class SocialsModule {}
