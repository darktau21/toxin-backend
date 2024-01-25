import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false })
export class OldEmailData {
  @Prop()
  code: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  userId: string;
}

export const OldEmailDataSchema = SchemaFactory.createForClass(OldEmailData);
