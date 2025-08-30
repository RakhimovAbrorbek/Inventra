import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private readonly prismaService: PrismaService) { }
  async create(createTagDto: CreateTagDto) {
    const tag = await this.prismaService.tags.findUnique({
      where: { name: createTagDto.name }
    })
    if (tag) throw new BadRequestException("Tag with given name already exists")
    const newTag = await this.prismaService.tags.create({
      data: createTagDto
    })
    return newTag
  }

  findAll() {
    return this.prismaService.tags.findMany()
  }

  async findOne(id: string) {
    const tag = await this.prismaService.tags.findUnique({
      where: { id }
    })
    if (!tag) throw new NotFoundException("Tag not found")
    return tag
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const nameTag = await this.prismaService.tags.findUnique({
      where: { name: updateTagDto.name }
    })
    if (nameTag) throw new BadRequestException("Tag with given name already exists")
    const updatedTag = await this.prismaService.tags.update({
      where: { id },
      data: updateTagDto
    })
    return updatedTag
  }

  async remove(id: string) {
    const tag = await this.prismaService.tags.findUnique({
      where: { id }
    })
    if (!tag) throw new NotFoundException("Tag not found")
    await this.prismaService.tags.delete({
      where: { id }
    })
    return {
      message: "Tag deleted successfully!"
    }
  }
}
