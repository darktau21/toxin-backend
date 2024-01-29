import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

import { FormatResponse } from '~/app/decorators';
import { Public } from '~/auth/decorators';
import { SortUsersQueryDto } from './dto';
const USER_CONTROLLER_NAME = 'users';

@Controller('user')
@ApiTags('Публичное api пользователей')
@UseInterceptors(CacheInterceptor)
@Public()
export class PublicUserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @FormatResponse(UserResponse, USERS_RESPONSE_FIELD_NAME)
  async getAllUsers(@Query() query: SortUsersQueryDto) {
    return this.userService.findMany(query);
  }

  @Get(':id')
  @FormatResponse(UserResponse, USER_RESPONSE_FIELD_NAME)
  async getUser(@Param('id') id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id string');
    }

    return this.userService.findById(id);
  }
}
