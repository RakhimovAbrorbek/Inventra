import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class InventoryService {
  constructor(private readonly prismaService: PrismaService,
    private readonly userService: UsersService
  ) { }
  async create(data: CreateInventoryDto) {
    const { ownerId } = data
    const exists = await this.userService.findOne(ownerId)
    if (!exists) {
      throw new NotFoundException("User not found")
    }
    const newInventory = await this.prismaService.inventories.create({
      data
    })
    return newInventory
  }

  findAll() {
    return this.prismaService.inventories.findMany({
      include: { owner: true }
    })
  }

  findByName(title: string) {
    const inventory = this.prismaService.inventories.findFirst({
      where: {
        title
      },
      include: {
        owner: true
      }
    })
    if (!inventory) {
      throw new NotFoundException("Inventory with the given name not found")
    }
    return inventory
  }

  async update(id: string, data: UpdateInventoryDto) {
    const exists = await this.prismaService.inventories.findFirst({
      where: { id }
    })
    if (!exists) {
      throw new NotFoundException("Inventory with the given id not found")
    }
    const updatedInventory = await this.prismaService.inventories.update({
      where: { id },
      data,
      include: {
        owner: true
      }
    })
    return updatedInventory
  }

  async remove(id: string) {
    const exists = await this.prismaService.inventories.findFirst({
      where: { id }
    })
    if (!exists) {
      throw new NotFoundException("Inventory with the given id not found")
    }
    await this.prismaService.inventories.delete({
      where: { id }
    })
    return {
      message: "Inventory deleted successfully!"
    }
  }

  findOne(id: string) {
    return this.prismaService.inventories.findUnique({
      where: { id }
    })
  }
}
