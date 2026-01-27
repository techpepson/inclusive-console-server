import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from '../../generated/prisma/enums';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  password: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
