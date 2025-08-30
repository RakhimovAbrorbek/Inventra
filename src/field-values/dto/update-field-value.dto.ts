import { PartialType } from '@nestjs/mapped-types';
import { CreateFieldValueDto } from './create-field-value.dto';

export class UpdateFieldValueDto extends PartialType(CreateFieldValueDto) {}
