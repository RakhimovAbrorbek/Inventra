import { BadRequestException, ConflictException, Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt'
import { EmailService } from '../email/email.service';
import { SignInDto } from './dto/sign-in.dto';
import { Users } from '@prisma/client';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid'
import { NormalizedOAuthUser } from './types/oauth.user';

@Injectable()
export class AuthService {
  constructor(private readonly PrismaService: PrismaService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService
  ) { }

  async signUp(data: SignUpDto) {
    const { email, password, confirmPassword } = data
    if (password !== confirmPassword) {
      throw new BadRequestException("Password does not match")
    }
    const user = await this.userService.findByEmail(email)
    if (user) {
      throw new ConflictException("User already exists!")
    }
    const emailVerificationLink = uuidv4()
    const emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await this.PrismaService.users.create({
      data: {
        email,
        passwordHash: hashedPassword,
        emailVerificationToken: emailVerificationLink,
        emailVerificationExpiry
      }
    })
    try {
      await this.emailService.sendMail(newUser)
      return {
        message: "Registeration is successfull before login check your email and verify!"
      }
    } catch (error) {
      throw new BadRequestException(`Error while sending an email, ${error}`)
    }
  }


  async signIn(data: SignInDto, res: Response) {
    const { email, password } = data
    const user = await this.userService.findByEmail(email)
    if (!user) {
      throw new NotFoundException("User not found")
    }
    if (user.passwordHash === null) {
      throw new BadRequestException("User not found")
    }
    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      throw new BadRequestException("Email or Password is not valid")
    }
    if (!user.isVerified) {
      throw new BadRequestException("The account has not been verified")
    }
    if (!user.isActive) {
      throw new BadRequestException("You are blocked by the admin")
    }
    const { accessToken, refreshToken } = await this.generateToken(user);
    res.cookie("refresh_token", refreshToken, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
      sameSite: "strict",
      signed: true
    })
    return {
      message: "Sign in successfull",
      access_token: accessToken
    }
  }

  async signOut(req: Request, res: Response) {
    const refresh_token = req.signedCookies["refresh_token"];
    if (!refresh_token) {
      throw new BadRequestException("Token Not Found");
    }
    try {
      await this.jwtService.verify(refresh_token);
    } catch (error) {
      throw new BadRequestException("Invalid Token");
    }
    res.clearCookie("refresh_token");
    return {
      success: true,
      message: "User logged out successfully",
    };
  }

  async refreshTokenUser(@Req() req: Request) {
    const refresh_token = req.signedCookies["refresh_token"];
    if (!refresh_token) {
      throw new BadRequestException("Refresh Token Not Found!");
    }

    let payload: any;
    try {
      payload = await this.jwtService.verify(refresh_token, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }
    const user = await this.userService.findOne(payload.id);
    if (!user) {
      throw new UnauthorizedException("User not found or not logged in");
    }
    const { accessToken } = await this.generateToken(user);
    return {
      success: true,
      access_token: accessToken,
    };
  }




  async generateToken(user: Users) {
    const payload = {
      id: user.id,
      isVerified: user.isVerified,
      isActive: user.isActive,
      email: user.email,
      isAdmin: user.isAdmin
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async validateOauthLogin(oauth: NormalizedOAuthUser, res: Response) {
    let socialLogin = await this.PrismaService.socialLogins.findUnique({
      where: {
        provider_providerUserId: {
          provider: oauth.provider,
          providerUserId: oauth.providerUserId,
        },
      },
      include: { user: true },
    });

    let user = null;
    if (socialLogin) {
      user = socialLogin.user;
    } else {
      if (oauth.email) {
        user = await this.PrismaService.users.findUnique({
          where: { email: oauth.email },
        });
      }

      if (!user) {
        user = await this.PrismaService.users.create({
          data: {
            email: oauth.email ?? `${oauth.provider}-${oauth.providerUserId}@example.com`,
            name: oauth.name,
            username: oauth.providerUserId,
            isVerified: oauth.emailVerified,
          },
        });
      }

      await this.PrismaService.socialLogins.create({
        data: {
          userId: user.id,
          provider: oauth.provider,
          providerUserId: oauth.providerUserId,
        },
      });
    }

    const { accessToken, refreshToken } = await this.generateToken(user);

    res.cookie('refresh_token', refreshToken, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
      sameSite: 'strict',
      signed: true,
    });

    return { access_token: accessToken };
  }


}
