import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsString, Min, } from "class-validator";
import { FieldType } from "@prisma/client";
export class CreateFieldDto {
  @IsNotEmpty()
  @IsString()
  inventoryId: string

  @IsNotEmpty()
  @IsString()
  title: string


  @IsNotEmpty()
  @IsEnum(FieldType)
  type: FieldType


  @IsBoolean()
  displayInTable?: boolean = true


  @IsInt()
  @Min(0)
  sortOrder?: number = 0
}
