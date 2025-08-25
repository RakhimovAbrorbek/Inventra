import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ItemsService {
  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async validateUserandInventory(creatorId: string, inventoryId: string) {
    const user = await this.prismaService.users.findUnique({
      where: { id: creatorId }
    })
    if (!user) throw new NotFoundException("User not found");

    const inventory = await this.prismaService.inventories.findUnique({
      where: {
        id: inventoryId
      }
    })
    if (!inventory) throw new NotFoundException("Inventory not found")
    return { user, inventory }
  }
  async create(createItemDto: CreateItemDto) {
    const { inventory } = await this.validateUserandInventory(createItemDto.creatorId, createItemDto.inventoryId)
    let prefix = inventory.title.slice(0, 4).toLowerCase()
    if (prefix.length < 4) prefix = prefix.padEnd(4, 'x');
    const lastNum = inventory.lastCustomNumber + 1
    const newCustomId = `${prefix}-${lastNum}`
    await this.prismaService.inventories.update({
      where: {
        id: inventory.id
      },
      data: {
        lastCustomNumber: lastNum
      }
    })
    const newItem = await this.prismaService.items.create({
      data: {
        creatorId: createItemDto.creatorId,
        inventoryId: createItemDto.inventoryId,
        customId: newCustomId
      },
      include: {
        inventory: true,
        creator: true
      }
    })
    return newItem
  }

  findAll() {
    return this.prismaService.items.findMany({
      include: {
        inventory: true,
        creator: true
      }
    })
  }

  async findOne(id: string) {
    const item = await this.prismaService.items.findUnique({
      where: {
        id
      }
    })
    if (!item) throw new NotFoundException("Item not found")
    return item
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    await this.findOne(id)
    const updated = await this.prismaService.items.update({
      where: { id },
      data: updateItemDto
    })

  }

  async remove(id: string) {
    await this.findOne(id)
    await this.prismaService.items.delete({
      where: { id }
    })
    return {
      message: "Item deleted Successfully"
    }
  }
}
