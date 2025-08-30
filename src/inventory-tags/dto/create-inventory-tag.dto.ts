import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateInventoryTagDto {
  @IsUUID()
  @IsNotEmpty()
  inventoryId: string

  @IsUUID()
  @IsNotEmpty()
  tagId: string
}
