import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class HeroDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  subTitle: string;

  @IsString()
  @IsOptional()
  primaryButtonText: string;

  @IsString()
  @IsOptional()
  secondaryButtonText: string;
}
