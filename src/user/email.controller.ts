import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '~/auth/decorators';
import { JwtAuthGuard } from '~/auth/guards';
import { IAccessTokenData } from '~/auth/interfaces';
import { UserService } from '~/user/user.service';

import { UserResponse } from './responses';

@Controller('email')
@UseGuards(JwtAuthGuard)
export class EmailController {
  constructor(private readonly userService: UserService) {}

  @Get(':code')
  async confirmEmail(
    @CurrentUser() currentUser: IAccessTokenData,
    @Param('code') code: string,
  ) {
    const user = await this.userService.confirmEmail(currentUser.id, code);
    return { user: new UserResponse(user) };
  }

  @Get('resendConfirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendConfirmation(
    @CurrentUser() tokenData: IAccessTokenData,
  ): Promise<null> {
    const user = await this.userService.findById(tokenData.id);

    if (user.isVerified) {
      throw new BadRequestException('user already verified');
    }

    await this.userService.generateEmailConfirmation(
      user._id.toString(),
      user.email,
    );

    return null;
  }
}
