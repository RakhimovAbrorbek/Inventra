import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { User } from 'src/common/decorators/user.decorator';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get('my-inventories')
  async getMyInventories(@User('id') userId: string) {
    return this.permissionsService.findByUser(userId);
  }


  @Get('inventory/:id/users')
  async getUsersByInventory(@Param('id') inventoryId: string) {
    return this.permissionsService.findByInventory(inventoryId);
  }
}
