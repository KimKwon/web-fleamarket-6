import { Controller, Post, Body, Res, Get, Req, Param } from '@nestjs/common';
import { Request, Response } from 'express';
import { MAX_COOKIE_AGE, TOKEN_NAME } from 'src/constants/auth';
import { AuthService } from './auth.service';
import { Code, OAuthSignupInfo, SigninInfo, SignupInfo } from './type/auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('oauth/github')
  async githubAuthentication(
    @Body() { code }: Code,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.getAccessToken(code);
    const userInfo = await this.authService.getUserInfoFromGithub(token);
    const { id: githubUserId, login: nickname } = userInfo;
    const OAuthUser = await this.authService.findOAuthUser(githubUserId);

    if (OAuthUser) {
      const token = this.authService.generateToken(OAuthUser);

      response.cookie(TOKEN_NAME, token, {
        maxAge: MAX_COOKIE_AGE,
        httpOnly: true,
      });

      return { isExist: true, user: OAuthUser };
    }

    return { isExist: false, user: { githubUserId, nickname } };
  }

  @Post('signup')
  async signup(
    @Body() user: SignupInfo | OAuthSignupInfo,
    @Res({ passthrough: true }) response: Response,
  ) {
    const lastId = await this.authService.signup(user);
    const insertedUser = await this.authService.findUserById(lastId);
    const token = this.authService.generateToken(insertedUser);

    response.cookie(TOKEN_NAME, token, {
      maxAge: MAX_COOKIE_AGE,
      httpOnly: true,
    });

    return insertedUser;
  }

  @Post('signin')
  async signin(
    @Body() user: SigninInfo,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userInfo = await this.authService.signin(user);
    const token = this.authService.generateToken(userInfo);

    response.cookie(TOKEN_NAME, token, {
      maxAge: MAX_COOKIE_AGE,
      httpOnly: true,
    });

    return userInfo;
  }

  @Get()
  async getUserInfo(@Req() request: Request) {
    const cookies = request.cookies;
    const token = cookies[TOKEN_NAME];

    if (!token) {
      return;
    }

    const userInfo = await this.authService.getUserInfo(cookies[TOKEN_NAME]);

    return userInfo;
  }

  @Get('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie(TOKEN_NAME, '', {
      maxAge: 0,
      httpOnly: true,
    });

    return;
  }

  @Get(':id')
  getUserInfoById(@Param('id') id: number) {
    return this.authService.findUserById(id);
  }
}
