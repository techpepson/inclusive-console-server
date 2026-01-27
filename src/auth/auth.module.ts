import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HelpersService } from '../helpers/helpers.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, HelpersService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
