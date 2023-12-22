import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

import { AuthService } from '~/auth/auth.service';
import { Cookie, Fingerprint } from '~/auth/decorators';
import { LoginDto, RegisterDto } from '~/auth/dto';
import { JwtAuthGuard } from '~/auth/guards';
import { IFingerprint } from '~/auth/interfaces';
import { AppConfigService } from '~/env.interface';

const REFRESH_TOKEN_COOKIE = 'refreshToken';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(ConfigService) private readonly configService: AppConfigService,
  ) {}

  private async sendTokens(
    tokens: Awaited<ReturnType<typeof this.authService.login>>,
    res: FastifyReply,
  ) {
    res.setCookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
      expires: new Date(tokens.refreshTokenData.expiresIn),
      httpOnly: true,
      path: '/v1/auth',
      sameSite: 'lax',
      secure: this.configService.get('NODE_ENV') === 'production',
    });

    res.code(HttpStatus.CREATED).send({ accessToken: tokens.accessToken });
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Fingerprint() fingerprint: IFingerprint,
    @Res() res: FastifyReply,
  ) {
    const tokens = await this.authService.login(loginDto, fingerprint);
    await this.sendTokens(tokens, res);
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Res() res: FastifyReply,
    @Cookie(REFRESH_TOKEN_COOKIE) refreshToken: string,
  ) {
    await this.authService.logout(refreshToken);
    res.clearCookie(REFRESH_TOKEN_COOKIE, {
      httpOnly: true,
      path: '/v1/auth',
      sameSite: 'lax',
      secure: this.configService.get('NODE_ENV') === 'production',
    });
    res.code(HttpStatus.NO_CONTENT).send();
  }

  @Get('refresh')
  async refresh(
    @Cookie(REFRESH_TOKEN_COOKIE) refreshToken: string,
    @Fingerprint() fp: IFingerprint,
    @Res() res: FastifyReply,
  ) {
    const tokens = await this.authService.refresh(refreshToken, fp);
    await this.sendTokens(tokens, res);
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Fingerprint() fingerprint: IFingerprint,
    @Res() res: FastifyReply,
  ) {
    await this.authService.register(registerDto);
    const tokens = await this.authService.login(registerDto, fingerprint);
    await this.sendTokens(tokens, res);
  }
}
