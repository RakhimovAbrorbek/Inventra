import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateInventoryDto {
  @IsNotEmpty()
  @IsString()
  ownerId: string

  @IsNotEmpty()
  @IsString()
  title: string


  @IsOptional()
  @IsString()
  description: string


  @IsOptional()
  @IsString()
  category: string

  @IsOptional()
  @IsString()
  imageUrl: string

  @IsOptional()
  @IsBoolean()
  isPublic: boolean
}
