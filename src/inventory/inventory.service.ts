import { Injectable, NotFoundException } from "@nestjs/common"
import { UpdateInventoryDto } from "./dto/update-inventory.dto"
import { CreateInventoryDto } from "./dto/create-inventory.dto"
import { PrismaService } from "src/prisma/prisma.service"
import { UsersService } from "src/users/users.service"

const ownerMinimalSelect = { id: true, email: true, username: true }

@Injectable()
export class InventoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService  ) {}

  async create(data: CreateInventoryDto) {
    const { ownerId } = data
    const exists = await this.userService.findOne(ownerId)
    if (!exists) throw new NotFoundException("User not found")
    return this.prismaService.inventories.create({ data })
  }

  async findAll() {
    return this.prismaService.inventories.findMany({
      where: { isPublic: true },
      include: { owner: { select: ownerMinimalSelect } }
    })
  }

  async findByName(title: string) {
    const inventory = await this.prismaService.inventories.findFirst({
      where: { title },
      include: { owner: { select: ownerMinimalSelect } }
    })
    if (!inventory) throw new NotFoundException("Inventory with the given name not found")
    return inventory
  }

  async update(id: string, data: UpdateInventoryDto) {
    const exists = await this.prismaService.inventories.findUnique({ where: { id } })
    if (!exists) throw new NotFoundException("Inventory not found")
    return this.prismaService.inventories.update({
      where: { id },
      data,
      include: { owner: { select: ownerMinimalSelect } }
    })
  }

  async remove(id: string) {
    const exists = await this.prismaService.inventories.findUnique({ where: { id } })
    if (!exists) throw new NotFoundException("Inventory not found")
    await this.prismaService.inventories.delete({ where: { id } })
    return { message: "Inventory deleted successfully!" }
  }

  async findOne(id: string) {
    return this.prismaService.inventories.findUnique({
      where: { id },
      include: { owner: { select: ownerMinimalSelect } }
    })
  }
}
