import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  address: string;

  @Prop({ default: 'student', enum: ['admin', 'student', 'supervisor', 'accountant'] })
  role: 'admin' | 'student' | 'supervisor' | 'accountant';

  @Prop({ default: 'active', enum: ['active', 'inactive', 'blocked'] })
  status: 'active' | 'inactive' | 'blocked';

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: false })
  isApprovedByAdmin: boolean;

  @Prop()
  otpCode: string;

  @Prop()
  otpExpiresAt: Date;
}

export type UserDocument = User & Document & { _id: Types.ObjectId };
export const UserSchema = SchemaFactory.createForClass(User);
