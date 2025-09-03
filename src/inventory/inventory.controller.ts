import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { User } from 'src/common/decorators/user.decorator';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) { }


  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createInventoryDto: CreateInventoryDto, @User("id") ownerId: string) {
    return this.inventoryService.create(createInventoryDto, ownerId);
  }

  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }


  @Get()
  findOne(@Body() name: string) {
    return this.inventoryService.findByName(name)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInventoryDto: UpdateInventoryDto) {
    return this.inventoryService.update(id, updateInventoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }
}
