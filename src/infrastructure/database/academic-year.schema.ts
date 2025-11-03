import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AcademicYearDocument = AcademicYear & Document;

@Schema()
export class AcademicYear {
  @Prop({ required: true })
  label: string;
}

export const AcademicYearSchema = SchemaFactory.createForClass(AcademicYear);
