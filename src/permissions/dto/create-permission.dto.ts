import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  inventoryId: string
}
