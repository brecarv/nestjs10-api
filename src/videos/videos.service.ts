import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { PrismaService } from '../prisma/prisma/prisma.service';
import { InvalidRelationError } from '../errors/invalid-relation.error';

@Injectable()
export class VideosService {
  constructor(private prismaService: PrismaService) {}

  async create(createVideoDto: CreateVideoDto & { file: Express.Multer.File }) {
    const categoryExists =
      (await this.prismaService.category.count({
        where: {
          id: createVideoDto.category_id,
        },
      })) != 0;

    if (!categoryExists) {
      throw new InvalidRelationError('Category does not exist');
    }

    return this.prismaService.video.create({
      data: {
        title: createVideoDto.title,
        description: createVideoDto.description,
        category_id: createVideoDto.category_id,
        file_path: createVideoDto.file.path,
      },
    });
  }

  findAll() {
    return this.prismaService.video.findMany({
      include: {
        category: true,
      },
    });
  }

  findOne(id: number) {
    return this.prismaService.video.findUniqueOrThrow({
      where: { id: id },
    });
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return this.prismaService.video.update({
      where: { id: id },
      data: updateVideoDto,
    });
  }

  remove(id: number) {
    return this.prismaService.video.delete({
      where: { id: id },
    });
  }
}
