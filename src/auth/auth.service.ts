import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from '../dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '../../generated/prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    payload: AuthDto,
    secret: string,
  ): Promise<Pick<User, 'id' | 'email' | 'role' | 'createdAt' | 'updatedAt'>> {
    const secretKey = this.configService.get<string>('admin.secret');

    if (!secretKey || secret !== secretKey) {
      throw new ForbiddenException('Secret key is invalid');
    }

    if (!payload?.email || !payload?.password) {
      throw new BadRequestException('Email and password are required');
    }

    const existing = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (existing) {
      throw new ConflictException('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(payload.password, salt);

    try {
      const created = await this.prisma.user.create({
        data: {
          name: payload.name,
          email: payload.email,
          password: hashedPassword,
          role: payload.role,
        },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return created;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('User with email already exists');
      }
      throw e;
    }
  }

  async login(payload: Partial<AuthDto>): Promise<{
    accessToken: string;
    user: Pick<User, 'id' | 'email' | 'role' | 'createdAt' | 'updatedAt'>;
  }> {
    if (!payload?.email || !payload?.password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: payload.email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      // Avoid disclosing whether the email exists
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(payload.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokenPayload = { id: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(tokenPayload);

    const safeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as const;
    return { accessToken, user: safeUser };
  }

  async deleteUser(
    id: string,
  ): Promise<Pick<User, 'id' | 'email' | 'role' | 'createdAt' | 'updatedAt'>> {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }

    const deleted = await this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return deleted;
  }

  async getAllUsers(): Promise<
    Pick<User, 'id' | 'email' | 'name' | 'role' | 'createdAt' | 'updatedAt'>[]
  > {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return users;
  }
}
