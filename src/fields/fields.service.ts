import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FieldsService {
  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async validateInventory(inventoryId: string) {
    const inventory = await this.prismaService.inventories.findUnique({
      where: { id: inventoryId }
    })
    if (!inventory) throw new NotFoundException("Inventory Not Found")
  }

  async create(data: CreateFieldDto) {
    await this.validateInventory(data.inventoryId)
    const newField = await this.prismaService.fields.create({
      data
    })
    return newField
  }

  findAll() {
    return this.prismaService.fields.findMany({
      include: {
        inventory: true
      }
    })
  }

  async findOne(id: string) {
    const field = await this.prismaService.fields.findUnique({
      where: {
        id
      }
    })
    if (!field) throw new NotFoundException("Field not found")
    return field
  }

  async update(id: string, data: UpdateFieldDto) {
    await this.findOne(id)
    await this.validateInventory(data.inventoryId)
    const updated = await this.prismaService.fields.update({
      where: {
        id
      },
      data
    })
  }

  async remove(id: string) {
    await this.findOne(id)
    await this.prismaService.fields.delete({
      where: { id }
    })
    return {
      message: "Field deleted successfully"
    }
  }
}
