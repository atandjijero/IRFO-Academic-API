import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class History {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  actionType: string;

  @Prop()
  description?: string;
}

export type HistoryDocument = History & Document;
export const HistorySchema = SchemaFactory.createForClass(History);
