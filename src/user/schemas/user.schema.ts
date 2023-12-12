import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum Genders {
  FEMALE = 'female',
  MALE = 'male',
}

export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema()
export class User {
  @Prop()
  birthday: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ enum: Genders, type: String })
  gender: Genders;

  @Prop({ default: false, select: false })
  isBlocked?: boolean;

  @Prop()
  isSubscriber: boolean;

  @Prop()
  lastName: string;

  @Prop()
  name: string;

  @Prop({ select: false })
  password?: string;

  @Prop({ default: Roles.USER, enum: Roles, type: String })
  role: Roles;
}

export const UserSchema = SchemaFactory.createForClass(User);
