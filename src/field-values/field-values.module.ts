import { Module } from '@nestjs/common';
import { FieldValuesService } from './field-values.service';
import { FieldValuesController } from './field-values.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FieldValuesController],
  providers: [FieldValuesService],
})
export class FieldValuesModule { }
