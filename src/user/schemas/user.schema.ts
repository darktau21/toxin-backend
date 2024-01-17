import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum Genders {
  FEMALE = 'female',
  MALE = 'male',
}

export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema({ timestamps: true, versionKey: false })
export class User {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: Date })
  birthday: Date;

  @Prop({ unique: true })
  email: string;

  @Prop({ enum: Genders, type: String })
  gender: Genders;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: true })
  isSubscriber: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  lastName: string;

  @Prop()
  name: string;

  @Prop()
  password: string;

  @Prop({ default: Roles.USER, enum: Roles, type: String })
  role: Roles;
}

export const UserSchema = SchemaFactory.createForClass(User);
