import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { VerifyCallback } from 'passport-google-oauth20';
import { NormalizedOAuthUser } from '../types/oauth.user';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: `${process.env.OAUTH_REDIRECT}/auth/github/callback`,
      scope: ['user:email'],
    });
  }

  authorizationParams(options: any): any {
    return {
      allow_signup: 'true',
    };
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const user: NormalizedOAuthUser = {
      provider: 'github',
      providerUserId: profile.id,
      email: profile.emails?.[0]?.value ?? null,
      name: profile.displayName ?? profile.username ?? null,
      avatar: profile.photos?.[0]?.value ?? null,
      emailVerified: true,
    };
    done(null, user);
  }
}
