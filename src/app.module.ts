import { ThemesModule } from './themes/themes.module';
import { ThemesController } from './themes/themes.controller';
import { EventsModule } from './events/events.module';
import { AboutModule } from './about/about.module';
import { HelpersModule } from './helpers/helpers.module';
import { HelpersService } from './helpers/helpers.service';
import { ContactModule } from './contact/contact.module';
import { AuthModule } from './auth/auth.module';
import { SocialsModule } from './socials/socials.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeroModule } from './hero/hero.module';
import { StatisticsModule } from './statistics/statistics.module';
import { MetricsModule } from './metrics/metrics.module';
import { FocusModule } from './focus/focus.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { ResourcesModule } from './resources/resources.module';

import { PrismaService } from './prisma/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';

@Module({
  imports: [
    ThemesModule,
    EventsModule,
    AboutModule,
    TestimonialsModule,
    ResourcesModule,
    FocusModule,
    MetricsModule,
    HelpersModule,
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    MulterModule.register({
      storage: memoryStorage(),
    }),
    ContactModule,
    SocialsModule,
    AuthModule,
    HeroModule,
    StatisticsModule,
  ],
  controllers: [ThemesController, AppController],
  providers: [HelpersService, AppService, PrismaService],
})
export class AppModule {}
