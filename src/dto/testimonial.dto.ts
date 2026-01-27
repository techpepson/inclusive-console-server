import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TestimonialDto {
  @IsString()
  @IsNotEmpty()
  speaker: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  statement: string;
}

export class CreateTestimonialsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestimonialDto)
  testimonials: TestimonialDto[];
}
