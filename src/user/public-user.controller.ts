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
} from '@nestjs/common';

import { CurrentUser } from '~/auth/decorators';
import { JwtAuthGuard } from '~/auth/guards';
import { SortUsersQueryDto } from '~/user/dto';
import { UserResponse } from '~/user/responses';
import { User, type UserDocument } from '~/user/schemas';
import { UserService } from '~/user/user.service';

@Controller('user')
export class PublicUserController {
  constructor(private readonly userService: UserService) {}

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCurrentUser(@CurrentUser() currentUser: UserDocument) {
    return this.userService.delete(currentUser.id);
  }

  @Get()
  async getAllUsers(@Query() query: SortUsersQueryDto) {
    const users = await this.userService.findMany(query);
    return { users: users.map((user) => new UserResponse(user)) };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() currentUser: User) {
    return { user: new UserResponse(currentUser) };
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return { user: user ? new UserResponse(user) : null };
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateCurrentUser(
    @CurrentUser() currentUser: UserDocument,
    @Body() updateData: Partial<User>,
  ) {
    const user = await this.userService.update(currentUser.id, updateData);
    return { user: new UserResponse(user) };
  }
}
