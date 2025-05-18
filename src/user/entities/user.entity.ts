import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IsEmail, IsString } from 'class-validator';

export type UserDocument = HydratedDocument<Users>;
@Schema({ timestamps: true })
export class Users {
  @Prop({ required: true, unique: true })
  @IsEmail()
  email: string;

  @Prop({ required: true, unique: true })
  email_id: string;

  @Prop({ required: false })
  @IsString()
  password: string;

  @Prop()
  @IsString()
  name: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(Users);
