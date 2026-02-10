import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class SocialDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  platform!: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  url!: string;
}
