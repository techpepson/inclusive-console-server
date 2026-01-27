import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  location: string;
}

export class CreateEventsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventDto)
  events: EventDto[];
}
