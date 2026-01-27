import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
  IsEmail,
  IsInt,
} from 'class-validator';

export class InspiringStoryDto {
  @IsString()
  @IsNotEmpty()
  speaker: string;

  @IsString()
  @IsNotEmpty()
  story: string;
}

export class KeyVoiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsOptional()
  followers?: number;
}

export class SupportingOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  website?: string;
}

export class FocusDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  statsLabel?: string;

  @IsString()
  @IsOptional()
  statsValue?: string;

  @IsString()
  @IsNotEmpty()
  hashTag: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : undefined;
      } catch {
        return undefined;
      }
    }
    return value;
  })
  @ValidateNested({ each: true })
  @Type(() => InspiringStoryDto)
  @IsOptional()
  inspiringStories?: InspiringStoryDto[];

  @IsArray()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) return undefined;
        return parsed.map((kv: any) => ({
          ...kv,
          followers:
            kv?.followers !== undefined &&
            kv?.followers !== null &&
            kv?.followers !== ''
              ? Number(kv.followers)
              : undefined,
        }));
      } catch {
        return undefined;
      }
    }
    return Array.isArray(value)
      ? value.map((kv: any) => ({
          ...kv,
          followers:
            kv?.followers !== undefined &&
            kv?.followers !== null &&
            kv?.followers !== ''
              ? Number(kv.followers)
              : undefined,
        }))
      : value;
  })
  @ValidateNested({ each: true })
  @Type(() => KeyVoiceDto)
  @IsOptional()
  keyVoices?: KeyVoiceDto[];

  @IsArray()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : undefined;
      } catch {
        return undefined;
      }
    }
    return value;
  })
  @ValidateNested({ each: true })
  @Type(() => SupportingOrganizationDto)
  @IsOptional()
  supportingOrganizations?: SupportingOrganizationDto[];
}

export class CreateFocusAreasDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FocusDto)
  focusAreas: FocusDto[];
}
