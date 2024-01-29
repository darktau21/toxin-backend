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
import {
  ApiExceptionResponse,
  ApiOkPaginatedResponse,
  ApiOkResponse,
} from '~/app/swagger';
import { Public } from '~/auth/decorators';

import { SortUsersQueryDto } from './dto';
import {
  USER_RESPONSE_FIELD_NAME,
  USERS_RESPONSE_FIELD_NAME,
  UserResponse,
} from './responses';
import { UserService } from './user.service';

const USER_CONTROLLER_NAME = 'users';

@Controller(USER_CONTROLLER_NAME)
@UseInterceptors(CacheInterceptor)
@Public()
@ApiTags('Публичное api пользователей')
export class PublicUserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @FormatResponse(UserResponse, USERS_RESPONSE_FIELD_NAME)
  @ApiOkPaginatedResponse(UserResponse, USERS_RESPONSE_FIELD_NAME, {
    description: 'Получить список пользователей',
  })
  async getAllUsers(@Query() query: SortUsersQueryDto) {
    return this.userService.findMany(query);
  }

  @Get(':id')
  @FormatResponse(UserResponse, USER_RESPONSE_FIELD_NAME)
  @ApiOkResponse(UserResponse, USER_RESPONSE_FIELD_NAME, {
    description: 'Получить пользователя по его id',
  })
  @ApiExceptionResponse(HttpStatus.BAD_REQUEST)
  async getUser(@Param('id') id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id string');
    }

    return this.userService.findById(id);
  }
}
