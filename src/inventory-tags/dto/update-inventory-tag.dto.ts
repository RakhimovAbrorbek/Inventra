import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryTagDto } from './create-inventory-tag.dto';

export class UpdateInventoryTagDto extends PartialType(CreateInventoryTagDto) {}
