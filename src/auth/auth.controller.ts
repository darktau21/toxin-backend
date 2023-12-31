import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

import { AuthService } from '~/auth/auth.service';
import { Cookie, Fingerprint } from '~/auth/decorators';
import { LoginDto, RegisterDto } from '~/auth/dto';
import { UnauthorizedGuard } from '~/auth/guards';
import { IFingerprint, REFRESH_TOKEN_COOKIE } from '~/auth/interfaces';
import { AppConfigService } from '~/config/app-config.service';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: AppConfigService,
  ) {}

  private setCookieToken(
    tokens: Awaited<ReturnType<typeof this.authService.login>>,
    res: FastifyReply,
  ) {
    const { secureCookie } = this.configService.getSecurity();

    res.setCookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
      expires: new Date(tokens.refreshTokenData.expiresIn),
      httpOnly: true,
      path: '/v1/auth',
      sameSite: 'lax',
      secure: secureCookie,
    });
  }

  @Post('login')
  @UseGuards(UnauthorizedGuard)
  async login(
    @Body() loginDto: LoginDto,
    @Fingerprint() fingerprint: IFingerprint,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const tokens = await this.authService.login(loginDto, fingerprint);
    this.setCookieToken(tokens, res);

    return { accessToken: tokens.accessToken };
  }

  @ApiBearerAuth()
  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Res({ passthrough: true }) res: FastifyReply,
    @Cookie(REFRESH_TOKEN_COOKIE) refreshToken: string,
  ): Promise<null> {
    const { secureCookie } = this.configService.getSecurity();

    await this.authService.logout(refreshToken);
    res.clearCookie(REFRESH_TOKEN_COOKIE, {
      httpOnly: true,
      path: '/v1/auth',
      sameSite: 'lax',
      secure: secureCookie,
    });
    return null;
  }

  @Get('refresh')
  async refresh(
    @Cookie(REFRESH_TOKEN_COOKIE) refreshToken: string,
    @Fingerprint() fp: IFingerprint,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const tokens = await this.authService.refresh(refreshToken, fp);
    this.setCookieToken(tokens, res);

    return { accessToken: tokens.accessToken };
  }

  @Post('register')
  @UseGuards(UnauthorizedGuard)
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto,
    @Fingerprint() fingerprint: IFingerprint,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    await this.authService.register(registerDto);
    const tokens = await this.authService.login(registerDto, fingerprint);
    this.setCookieToken(tokens, res);

    return { accessToken: tokens.accessToken };
  }
}
