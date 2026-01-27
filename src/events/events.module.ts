import { Module } from '@nestjs/common';
import { EventService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [AuthModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [EventsController],
  providers: [EventService, PrismaService],
})
export class EventsModule {}
