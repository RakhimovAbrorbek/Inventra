import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { NormalizedOAuthUser } from '../types/oauth.user';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly config: ConfigService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.OAUTH_REDIRECT}/auth/google/callback`,
      scope: ['email', 'profile'],
    });

  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const user: NormalizedOAuthUser = {
      provider: 'google',
      providerUserId: profile.id,
      email: profile.emails?.[0]?.value ?? null,
      name: profile.displayName ?? null,
      avatar: profile.photos?.[0]?.value ?? null,
      emailVerified: profile.emails?.[0]?.verified ?? true,
    };
    done(null, user);
  }
}
