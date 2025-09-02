import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventory/inventory.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ItemsModule } from './items/items.module';
import { FieldsModule } from './fields/fields.module';
import { FieldValuesModule } from './field-values/field-values.module';
import { TagsModule } from './tags/tags.module';
import { InventoryTagsModule } from './inventory-tags/inventory-tags.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ".env"
  }), UsersModule, EmailModule, AuthModule, InventoryModule, PermissionsModule, ItemsModule, FieldsModule, FieldValuesModule, TagsModule, InventoryTagsModule, CommentsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
