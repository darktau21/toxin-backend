import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class EmailDataResponse {
  @Expose()
  @ApiPropertyOptional({
    description: 'Когда истекает код подтверждения в письме',
    type: String,
  })
  expiresIn?: Date;

  @Expose()
  @ApiProperty({ description: 'Новый email', type: String })
  newEmail: string;

  @Expose()
  @ApiPropertyOptional({ description: 'Новый email', type: String })
  oldEmail?: string;

  constructor(data: EmailDataResponse) {
    Object.assign(this, data);
  }
}
