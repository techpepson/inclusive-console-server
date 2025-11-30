import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class StatsDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  value: number;
}
