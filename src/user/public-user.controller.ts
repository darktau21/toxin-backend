import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

import { SortUsersQueryDto } from '~/user/dto';
import { UserResponse } from '~/user/responses';
import { UserService } from '~/user/user.service';

@ApiTags('Публичное api пользователей')
@UseInterceptors(CacheInterceptor)
@Controller('user')
export class PublicUserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(@Query() query: SortUsersQueryDto) {
    const { users, ...pageData } = await this.userService.findMany(query);
    return { users: users.map((user) => new UserResponse(user)), ...pageData };
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id string');
    }
    const user = await this.userService.findById(id);
    return { user: user ? new UserResponse(user) : null };
  }
}
