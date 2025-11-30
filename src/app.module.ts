import { HeroModule } from './hero/hero.module';
import { HeroController } from './hero/hero.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeroService } from './hero/hero.service';
import { PrismaService } from './prisma/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    HeroModule,
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [HeroController, AppController],
  providers: [AppService, HeroService, PrismaService],
})
export class AppModule {}
