import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventory/inventory.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ".env"
  }), UsersModule, EmailModule, AuthModule, InventoryModule, PermissionsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
