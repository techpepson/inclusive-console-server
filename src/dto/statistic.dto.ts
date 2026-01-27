import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class StatisticDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class CreateStatisticsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatisticDto)
  statistics: StatisticDto[];
}
