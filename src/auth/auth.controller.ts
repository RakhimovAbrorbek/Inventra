import { Controller, Post, Body, Req, Res, HttpCode, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Request, Response } from 'express';
import { GoogleAuthGuard } from './guards/google.auth.guard';
import { GithubAuthGuard } from './guards/github.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signIn(signInDto, res);
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signOut(req, res);
  }
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    const tokens = await this.authService.validateOauthLogin(user, res);

    return res.json({
      message: 'Google login successful',
      ...tokens,
    });
  }

  @Get('github')
  @UseGuards(GithubAuthGuard)
  async githubLogin() {
  }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async githubCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    const tokens = await this.authService.validateOauthLogin(user, res);

    return res.json({
      message: 'GitHub login successful',
      ...tokens,
    });
  }
}



