import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateFieldValueDto {
  @IsUUID()
  itemId: string;

  @IsUUID()
  fieldId: string;

  @IsOptional() @IsString()
  valueString?: string;

  @IsOptional() @IsNumber()
  valueNumber?: number;

  @IsOptional() @IsBoolean()
  valueBoolean?: boolean;

  @IsOptional() @IsDateString()
  valueDate?: Date;
}
