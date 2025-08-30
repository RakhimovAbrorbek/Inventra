import { Module } from '@nestjs/common';
import { InventoryTagsService } from './inventory-tags.service';
import { InventoryTagsController } from './inventory-tags.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InventoryTagsController],
  providers: [InventoryTagsService],
})
export class InventoryTagsModule { }
