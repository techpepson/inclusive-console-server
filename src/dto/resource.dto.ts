import { IsNotEmpty, IsString } from 'class-validator';

export class ResourceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  type: string; // 'IMAGE' | 'FILE' | 'VIDEO'
}
