import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { ClientSession } from 'mongoose';

import { FormatResponse, Transaction } from '~/app/decorators';
import { HttpException } from '~/app/exceptions';
import { WithTransactionInterceptor } from '~/app/interceptors';
import { AppConfigService } from '~/config/app-config.service';
import { EmailService } from '~/email/email.service';
import { MailService } from '~/mail/mail.service';

import { AuthService } from './auth.service';
import { Cookie, Fingerprint, Public } from './decorators';
import { LoginDto, RegisterDto } from './dto';
import { UnauthorizedGuard } from './guards';
import { IFingerprint, ITokens, REFRESH_TOKEN_COOKIE } from './interfaces';
import { AccessTokenResponse } from './responses';

@ApiTags('Авторизация')
@Controller('auth')
@Public()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: AppConfigService,
    private readonly mailService: MailService,
    private readonly emailService: EmailService,
  ) {}

  private setCookieToken(
    tokens: Pick<ITokens, 'refreshToken' | 'refreshTokenData'>,
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
  @FormatResponse(AccessTokenResponse)
  async login(
    @Body() loginDto: LoginDto,
    @Fingerprint() fingerprint: IFingerprint,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const tokens = await this.authService.login(loginDto, fingerprint);
    if (!tokens) {
      throw new HttpException(
        'wrong email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    this.setCookieToken(tokens, res);

    return tokens;
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
  @UseInterceptors(WithTransactionInterceptor)
  @FormatResponse(AccessTokenResponse)
  async refresh(
    @Cookie(REFRESH_TOKEN_COOKIE) refreshToken: string,
    @Fingerprint() fp: IFingerprint,
    @Res({ passthrough: true }) res: FastifyReply,
    @Transaction() session: ClientSession,
  ) {
    const tokens = await this.authService.refresh(refreshToken, fp, session);
    if (!tokens) {
      throw new HttpException(
        'refresh session expired',
        HttpStatus.UNAUTHORIZED,
      );
    }

    this.setCookieToken(tokens, res);

    return tokens;
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(UnauthorizedGuard)
  @UseInterceptors(WithTransactionInterceptor)
  @FormatResponse(AccessTokenResponse)
  async register(
    @Body() registerDto: RegisterDto,
    @Fingerprint() fingerprint: IFingerprint,
    @Res({ passthrough: true }) res: FastifyReply,
    @Transaction() session: ClientSession,
  ) {
    const { _id, email, lastName, name } = await this.authService.register(
      registerDto,
      session,
    );
    const { code } = await this.emailService.update(
      email,
      _id.toString(),
      session,
    );
    this.mailService.sendRegistrationEmail(email, { code, lastName, name });
    const tokens = await this.authService.login(
      registerDto,
      fingerprint,
      session,
    );
    this.setCookieToken(tokens, res);

    return tokens;
  }
}
