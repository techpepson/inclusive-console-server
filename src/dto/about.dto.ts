import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsInt,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class AboutDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  missionDescription?: string;

  @IsString()
  @IsOptional()
  visionDescription?: string;
}

export class TeamMemberDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  role!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsOptional()
  profilePicture?: string;
}

export class TeamMemberUpsertDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  role!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsOptional()
  profilePicture?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  profilePictureUploadIndex?: number;
}

export class CreateTeamMembersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberDto)
  teamMembers!: TeamMemberDto[];
}

export class SponsorDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  website?: string;
}

export class CreateSponsorsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SponsorDto)
  sponsors!: SponsorDto[];
}

export class CompleteAboutDto {
  @ValidateNested()
  @Type(() => AboutDto)
  @IsOptional()
  about?: AboutDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberUpsertDto)
  @IsOptional()
  teamMembers?: TeamMemberUpsertDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SponsorDto)
  @IsOptional()
  sponsors?: SponsorDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  deleteTeamMemberIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  deleteSponsorIds?: string[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  clearTeamMembers?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  clearSponsors?: boolean;
}
