import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { CurrentUser } from '~/auth/decorators';
import { JwtAuthGuard } from '~/auth/guards';
import { IAccessTokenData } from '~/auth/interfaces';
import { SortUsersQueryDto, UpdateSelfUserDto } from '~/user/dto';
import { UserResponse } from '~/user/responses';
import { UserService } from '~/user/user.service';

@Controller('user')
export class PublicUserController {
  constructor(private readonly userService: UserService) {}

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCurrentUser(@CurrentUser() currentUser: IAccessTokenData) {
    return this.userService.delete(currentUser.id);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  async getAllUsers(@Query() query: SortUsersQueryDto) {
    const { users, ...pageData } = await this.userService.findMany(query);
    return { users: users.map((user) => new UserResponse(user)), ...pageData };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() currentUser: IAccessTokenData) {
    const user = await this.userService.findById(currentUser.id);
    return { user: new UserResponse(user) };
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return { user: user ? new UserResponse(user) : null };
  }

  @Get('me/restore')
  @UseGuards(JwtAuthGuard)
  async restoreCurrentUser(@CurrentUser() currentUser: IAccessTokenData) {
    const user = await this.userService.restore(currentUser.id);
    return { user: new UserResponse(user) };
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateCurrentUser(
    @CurrentUser() currentUser: IAccessTokenData,
    @Body() updateData: UpdateSelfUserDto,
  ) {
    const user = await this.userService.update(currentUser.id, {
      ...updateData,
      birthday: new Date(updateData.birthday),
    });
    return { user: new UserResponse(user) };
  }
}
