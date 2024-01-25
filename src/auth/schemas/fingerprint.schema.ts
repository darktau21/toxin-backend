import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IFingerprint } from '../interfaces';
import { Location, LocationSchema } from './location.schema';

@Schema({ _id: false, versionKey: false })
export class Fingerprint implements IFingerprint {
  @Prop()
  ip: string;

  @Prop({ type: LocationSchema })
  location?: Location;

  @Prop()
  userAgent?: string;
}

export const FingerprintSchema = SchemaFactory.createForClass(Fingerprint);
