import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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
  name: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  profilePicture?: string;
}

export class CreateTeamMembersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberDto)
  teamMembers: TeamMemberDto[];
}

export class SponsorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

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
  sponsors: SponsorDto[];
}

export class CompleteAboutDto {
  @ValidateNested()
  @Type(() => AboutDto)
  @IsOptional()
  about?: AboutDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberDto)
  @IsOptional()
  teamMembers?: TeamMemberDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SponsorDto)
  @IsOptional()
  sponsors?: SponsorDto[];
}
