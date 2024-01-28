import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { IUser } from '~/user/interfaces';
import { USER_SCHEMA_NAME } from '~/user/schemas';

import { IRefreshTokenData } from '../interfaces';
import { Fingerprint, FingerprintSchema } from './fingerprint.schema';

export const REFRESH_TOKEN_DATA_SCHEMA_NAME = 'schema:refreshTokenData';
export const RefreshTokenDataSchemaFactory = (refreshTokenTtl: number) => {
  @Schema({ timestamps: true, versionKey: false })
  class RefreshTokenData implements IRefreshTokenData {
    @Prop({ expires: refreshTokenTtl })
    createdAt: Date;

    @Prop({ type: Date })
    expiresIn: Date;

    @Prop({ type: FingerprintSchema })
    fingerprint: Fingerprint;

    @Prop()
    refreshToken: string;

    @Prop({ ref: USER_SCHEMA_NAME, type: Types.ObjectId })
    user: IUser;
  }
  return SchemaFactory.createForClass(RefreshTokenData);
};
