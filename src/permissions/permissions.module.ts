import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { InventoryModule } from 'src/inventory/inventory.module';

@Module({
  imports: [PrismaModule, UsersModule, InventoryModule],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule { }
