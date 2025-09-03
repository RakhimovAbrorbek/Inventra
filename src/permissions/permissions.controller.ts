import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-inventories')
  async getMyInventories(@User('id') userId: string) {
    return this.permissionsService.findByUser(userId);
  }


  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('inventory/:id/users')
  async getUsersByInventory(@Param('id') inventoryId: string) {
    return this.permissionsService.findByInventory(inventoryId);
  }
}
