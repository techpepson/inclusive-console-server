import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { AboutService } from './about.service';
import {
  TeamMemberDto,
  CreateTeamMembersDto,
  SponsorDto,
  CompleteAboutDto,
} from '../dto/about.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('about')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  // Complete About Data Endpoint (Unified)
  @Put()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('profilePictures', 50))
  @HttpCode(HttpStatus.OK)
  async upsertCompleteAbout(
    @Body() dto: CompleteAboutDto,
    @UploadedFiles() profilePictureFiles?: Express.Multer.File[],
  ) {
    return this.aboutService.upsertCompleteAbout(dto, profilePictureFiles);
  }

  // About Section Endpoints
  @Get('section')
  async getAbout() {
    return this.aboutService.getAbout();
  }

  // Team Members Endpoints
  @Get('team')
  async getAllTeamMembers() {
    return this.aboutService.getAllTeamMembers();
  }

  @Get('team/single')
  async getTeamMemberById(@Query('id') id: string) {
    return this.aboutService.getTeamMemberById(id);
  }

  @Post('team')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('profilePicture'))
  @HttpCode(HttpStatus.CREATED)
  async createTeamMember(
    @Body() dto: TeamMemberDto,
    @UploadedFile() profilePictureFile?: Express.Multer.File,
  ) {
    return this.aboutService.createTeamMember(dto, profilePictureFile);
  }

  @Post('team/bulk')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('profilePictures', 50))
  @HttpCode(HttpStatus.CREATED)
  async createMultipleTeamMembers(
    @Body() dto: CreateTeamMembersDto,
    @UploadedFiles() profilePictureFiles?: Express.Multer.File[],
  ) {
    return this.aboutService.createMultipleTeamMembers(
      dto.teamMembers,
      profilePictureFiles,
    );
  }

  @Put('team')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('profilePicture'))
  @HttpCode(HttpStatus.OK)
  async updateTeamMember(
    @Query('id') id: string,
    @Body() dto: TeamMemberDto,
    @UploadedFile() profilePictureFile?: Express.Multer.File,
  ) {
    return this.aboutService.updateTeamMember(id, dto, profilePictureFile);
  }

  @Delete('team')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async deleteTeamMember(@Query('id') id: string) {
    return this.aboutService.deleteTeamMember(id);
  }

  // Sponsors Endpoints
  @Get('sponsors')
  async getAllSponsors() {
    return this.aboutService.getAllSponsors();
  }

  @Get('sponsors/single')
  async getSponsorById(@Query('id') id: string) {
    return this.aboutService.getSponsorById(id);
  }

  @Post('sponsors')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  async createSponsor(@Body() dto: SponsorDto) {
    return this.aboutService.createSponsor(dto);
  }

  @Put('sponsors')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async updateSponsor(@Query('id') id: string, @Body() dto: SponsorDto) {
    return this.aboutService.updateSponsor(id, dto);
  }

  @Delete('sponsors')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async deleteSponsor(@Query('id') id: string) {
    return this.aboutService.deleteSponsor(id);
  }
}
