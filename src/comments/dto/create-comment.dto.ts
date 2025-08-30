import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateCommentDto {
  // inventoryId String
  // userId      String
  // content     String
  // createdAt   DateTime @default(now())

  @IsUUID()
  @IsNotEmpty()
  inventoryId: string



}
