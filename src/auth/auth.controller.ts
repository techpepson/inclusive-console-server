import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from '../dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() payload: Partial<AuthDto>) {
    return this.authService.login(payload);
  }

  @Post('register')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() payload: AuthDto, @Query('pse') secret: string) {
    return this.authService.register(payload, secret);
  }

  @Delete('user')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Query('id') id: string) {
    return this.authService.deleteUser(id);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getAllUsers() {
    return this.authService.getAllUsers();
  }
}
