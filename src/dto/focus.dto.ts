import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FocusDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsNotEmpty()
  hashTags: string[];

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
