import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MetricDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsString()
  @IsNotEmpty()
  growth: string;
}
