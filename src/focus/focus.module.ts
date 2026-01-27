import { FocusService } from './focus.service';
import { Module } from '@nestjs/common';
import { FocusController } from './focus.controller';
import { PrismaService } from '../prisma/prisma.service';
import { HelpersModule } from '../helpers/helpers.module';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { HelpersService } from '../helpers/helpers.service';

@Module({
  imports: [
    HelpersModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [FocusController],
  providers: [FocusService, PrismaService, HelpersService],
})
export class FocusModule {}
