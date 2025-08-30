import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventoryTagsService } from './inventory-tags.service';
import { CreateInventoryTagDto } from './dto/create-inventory-tag.dto';
import { UpdateInventoryTagDto } from './dto/update-inventory-tag.dto';

@Controller('inventory-tags')
export class InventoryTagsController {
  constructor(private readonly inventoryTagsService: InventoryTagsService) { }

  @Post()
  create(@Body() createInventoryTagDto: CreateInventoryTagDto) {
    return this.inventoryTagsService.create(createInventoryTagDto);
  }

  @Get()
  findAll() {
    return this.inventoryTagsService.findAll();
  }


}
