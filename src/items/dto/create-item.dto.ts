import { IsNotEmpty, IsString } from "class-validator"

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  inventoryId: string

  @IsString()
  @IsNotEmpty()
  creatorId: string

}
