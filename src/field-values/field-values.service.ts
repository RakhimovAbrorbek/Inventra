import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFieldValueDto } from './dto/create-field-value.dto';
import { UpdateFieldValueDto } from './dto/update-field-value.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { throws } from 'assert';

@Injectable()
export class FieldValuesService {
  constructor(private readonly prismaService: PrismaService) { }

  async validateItemandField(itemId: string, fieldId: string) {
    const item = await this.prismaService.items.findUnique({
      where: { id: itemId }
    })
    if (!item) throw new NotFoundException("Item not found")


    const field = await this.prismaService.fields.findUnique({
      where: { id: fieldId }
    })
    if (!field) throw new NotFoundException("Field not found")
    return { item, field }
  }
  async create(createFieldValueDto: CreateFieldValueDto) {
    const { item, field } = await this.validateItemandField(createFieldValueDto.itemId, createFieldValueDto.fieldId)


    if (field.type === "text" && !createFieldValueDto.valueString)
      throw new BadRequestException("Field requires valueString");

    if (field.type === "number" && createFieldValueDto.valueNumber === undefined)
      throw new BadRequestException("Field requires valueNumber");

    if (field.type === "boolean" && createFieldValueDto.valueBoolean === undefined)
      throw new BadRequestException("Field requires valueBoolean");

    if (field.type === "date" && !createFieldValueDto.valueDate)
      throw new BadRequestException("Field requires valueDate");

    return this.prismaService.fieldValues.create({
      data: createFieldValueDto
    })
  }

  findAll() {
    return this.prismaService.fieldValues.findMany()
  }

  async findOne(id: string) {
    const fieldValue = await this.prismaService.fieldValues.findUnique({
      where: { id }
    })
    return fieldValue
  }

  async update(id: string, updateFieldValueDto: UpdateFieldValueDto) {
    await this.findOne(id)
    const updated = await this.prismaService.fieldValues.update({
      where: { id },
      data: updateFieldValueDto
    })
    return updated
  }

  async remove(id: string) {
    await this.findOne(id)
    await this.prismaService.fieldValues.delete({
      where: { id }
    })
    return {
      message: "Field Value Deleted Successfully!"
    }
  }
}
