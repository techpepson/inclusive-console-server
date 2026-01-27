import { Module } from '@nestjs/common';
import { AboutService } from './about.service';
import { AboutController } from './about.controller';
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
  controllers: [AboutController],
  providers: [AboutService, PrismaService, HelpersService],
})
export class AboutModule {}
