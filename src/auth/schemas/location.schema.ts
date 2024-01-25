import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Lookup } from 'geoip-lite';

@Schema({ _id: false, versionKey: false })
export class Location implements Lookup {
  @Prop()
  area: number;

  @Prop()
  city: string;

  @Prop()
  country: string;

  @Prop({ enum: ['0', '1'] })
  eu: '0' | '1';

  @Prop({ type: [Number] })
  ll: [number, number];

  @Prop()
  metro: number;

  @Prop({ type: [Number] })
  range: [number, number];

  @Prop()
  region: string;

  @Prop()
  timezone: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
