import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateCommentDto {
  @IsUUID()
  @IsNotEmpty()
  inventoryId: string

  @IsUUID()
  @IsNotEmpty()
  userId: string

  @IsString()
  @IsNotEmpty()
  content: string
}
