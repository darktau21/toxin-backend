import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { Genders, IUser, Roles } from '../interfaces';

export const USER_SCHEMA_NAME = 'schema:user';

export const UserSchemaFactory = (userDeleteTtl: number) => {
  @Schema({ timestamps: true, versionKey: false })
  class User implements IUser {
    _id: Types.ObjectId;

    @Prop({ type: Date })
    birthday: Date | string;

    @Prop({ expires: userDeleteTtl, type: Date })
    deletedAt?: Date | string;

    @Prop({ type: Date })
    deletionDate?: Date | string;

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

  return SchemaFactory.createForClass(User);
};
