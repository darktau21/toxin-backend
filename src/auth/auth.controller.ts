import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

import { LoginDto } from '~/auth/dto';
import { AppConfigService } from '~/env.interface';

import { AuthService } from './auth.service';
import { Cookie, Fingerprint } from './decorators';
import { RegisterDto } from './dto';
import { IFingerprint } from './interfaces';

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
      secure:
        this.configService.get('NODE_ENV', { infer: true }) === 'production',
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
