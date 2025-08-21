import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class PermissionsService {
  constructor(private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
    private readonly inventoryService: InventoryService
  ) { }
  async create(data: CreatePermissionDto) {
    const exists = await this.userService.findOne(data.userId)
    if (!exists) {
      throw new NotFoundException("User not found")
    }
    const inventoryExists = await this.inventoryService.findOne(data.inventoryId)
    if (!inventoryExists) {
      throw new NotFoundException("Inventory not found")
    }
    const newPermission = await this.prismaService.accessControl.create({
      data
    })
    return newPermission
  }

  findAll() {
    return this.prismaService.accessControl.findMany()
  }

  findOne(userId: string) {
    return this.prismaService.accessControl.findFirst({
      where: { userId }
    })
  }


}
