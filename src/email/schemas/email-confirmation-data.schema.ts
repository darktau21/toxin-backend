import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IEmailConfirmationData } from '../interfaces';

export const EMAIL_CONFIRMATION_DATA_SCHEMA_NAME =
  'schema:emailConfirmationData';

export const EmailConfirmationDataSchemaFactory = (
  emailConfirmationTtl: number,
) => {
  @Schema({ timestamps: true, versionKey: false })
  class EmailConfirmationData implements IEmailConfirmationData {
    @Prop()
    code: string;

    createdAt: Date;

    @Prop({ type: Date })
    expiresIn?: Date;

    @Prop({ unique: true })
    newEmail: string;

    @Prop({ expires: emailConfirmationTtl, type: Date })
    requestedAt?: Date;

    @Prop()
    userId: string;
  }

  return SchemaFactory.createForClass(EmailConfirmationData);
};
