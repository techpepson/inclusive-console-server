import {
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { supabase } from '../supabase/supabase-client';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../../generated/prisma/client';

@Injectable()
export class HelpersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly bucketName = 'inclusive-media';
  async uploadImage(
    file: Express.Multer.File,
    firstName: string,
    mediaType: string,
  ) {
    if (!file) {
      return {
        path: null,
        publicUrl: null,
      };
    }

    const fileExt = file.originalname.split('.').pop();
    const timestamp = Date.now();
    const rand = Math.random().toString(36).slice(2, 8);
    const fileName = `${firstName}-${mediaType}-${timestamp}-${rand}.${fileExt}`;
    const filePath = `images/${fileName}`;

    const { data, error } = await supabase.storage
      .from(this.bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype ?? 'image/*',
        upsert: false,
      });

    if (error) {
      throw new PreconditionFailedException(
        'Upload of image failed',
        error.message,
      );
    }

    const { data: publicData } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);

    return {
      path: data.path,
      publicUrl: publicData.publicUrl,
    };
  }

  async uploadImages(
    files: Express.Multer.File[],
    firstName: string,
    mediaType: string,
  ) {
    if (!files || files.length === 0) {
      return [] as { path: string | null; publicUrl: string | null }[];
    }

    const results: { path: string | null; publicUrl: string | null }[] = [];

    for (const file of files) {
      const single = await this.uploadImage(file, firstName, mediaType);
      results.push(single);
    }

    return results;
  }

  async checkUser(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    //check if user exists
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return user;
  }
}
