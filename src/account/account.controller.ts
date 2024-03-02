import { type MemoryStorageFile } from '@blazity/nest-file-fastify';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import type { IUser } from '~/user/interfaces';

import { ValidatedUploadedFile } from '~/app/decorators';
import { CurrentUser } from '~/auth/decorators';
import { FileInterceptor } from '~/s3/interceptors';
import { AvatarS3Service } from '~/s3/services';

const ACCOUNT_CONTROLLER_ROUTE = 'account';

@Controller(ACCOUNT_CONTROLLER_ROUTE)
export class AccountController {
  constructor(
    @Inject(AvatarS3Service) private readonly avatarS3Service: AvatarS3Service,
  ) {}

  @Get()
  getCurrentUser(@CurrentUser() user: IUser) {
    console.log(user);
    return user;
  }

  @Post('/avatar')
  // @UseInterceptors(
  //   FileInterceptor('avatar', {
  //     filter: (_: unknown, file: MemoryStorageFile) => {
  //       if (file.mimetype !== 'image/png' || file.size > 8000) {
  //         throw new Error('testFile');
  //       }
  //     },
  //   }),
  // )
  // @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(@Body() body: unknown) {
    // avatar: MemoryStorageFile, // @ValidatedUploadedFile({ fileType: 'image/png', maxSize: 8000 }) // @CurrentUser() user: IUser,
    // console.log(avatar);
    // this.avatarS3Service.put(user._id.toString(), avatar);
    console.log(body);
    return 'ok';
  }
}
