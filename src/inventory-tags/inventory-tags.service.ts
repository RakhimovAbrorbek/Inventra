import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryTagDto } from './dto/create-inventory-tag.dto';
import { UpdateInventoryTagDto } from './dto/update-inventory-tag.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InventoryTagsService {
  constructor(private readonly prismaService: PrismaService) { }


  async validateInventoryandTag(inventoryId: string, tagId: string) {
    const inventory = await this.prismaService.inventories.findUnique({
      where: { id: inventoryId }
    })
    if (!inventory) throw new NotFoundException("Inventory  not found")

    const tag = await this.prismaService.tags.findUnique({
      where: {
        id: tagId
      }
    })
    if (!tag) throw new NotFoundException("Tag not found")
    return { inventory, tag }
  }

  async create(createInventoryTagDto: CreateInventoryTagDto) {
    const iTag = await this.prismaService.inventoryTags.findUnique({
      where: {
        inventoryId_tagId: {
          inventoryId: createInventoryTagDto.inventoryId,
          tagId: createInventoryTagDto.tagId
        }
      }
    })
    if (!iTag) throw new BadRequestException("Inventory Tag already exists")
    const newTag = await this.prismaService.inventoryTags.create({
      data: createInventoryTagDto
    })
    return newTag
  }

  findAll() {
    return this.prismaService.inventoryTags.findMany({
      include: {
        inventory: true,
        tag: true
      }
    })
  }
}
