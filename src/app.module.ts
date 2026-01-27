import { EventsModule } from './events/events.module';
import { AboutModule } from './about/about.module';
import { HelpersModule } from './helpers/helpers.module';
import { HelpersService } from './helpers/helpers.service';
import { ContactModule } from './contact/contact.module';
import { ContactController } from './contact/contact.controller';
import { ContactService } from './contact/contact.service';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeroModule } from './hero/hero.module';
import { StatisticsModule } from './statistics/statistics.module';
import { MetricsModule } from './metrics/metrics.module';
import { FocusModule } from './focus/focus.module';
import { TestimonialsModule } from './testimonials/testimonials.module';

import { PrismaService } from './prisma/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';

@Module({
  imports: [
    EventsModule,
    AboutModule,
    TestimonialsModule,
    FocusModule,
    MetricsModule,
    HelpersModule,
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    MulterModule.register({
      storage: memoryStorage(),
    }),
    ContactModule,
    AuthModule,
    HeroModule,
    StatisticsModule,
  ],
  controllers: [ContactController, AppController],
  providers: [HelpersService, ContactService, AppService, PrismaService],
})
export class AppModule {}
