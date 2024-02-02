import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FormatResponse } from '~/app/decorators';
import { ApiOkPaginatedResponse, ApiOkResponse } from '~/app/swagger';
import { Public } from '~/auth/decorators';

import { SortUsersQueryDto } from './dto';
import {
  USER_RESPONSE_FIELD_NAME,
  USERS_RESPONSE_FIELD_NAME,
  UserResponse,
} from './responses';
import { UserService } from './user.service';

const USER_CONTROLLER_ROUTE = 'users';

@Controller(USER_CONTROLLER_ROUTE)
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
  async getAll(@Query() query: SortUsersQueryDto) {
    return this.userService.findMany(query);
  }

  @Get(':id')
  @FormatResponse(UserResponse, USER_RESPONSE_FIELD_NAME)
  @ApiOkResponse(UserResponse, USER_RESPONSE_FIELD_NAME, {
    description: 'Получить пользователя по его id',
  })
  async getById(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}
