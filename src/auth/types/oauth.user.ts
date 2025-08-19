export type OAuthProvider = 'google' | 'github';

export interface NormalizedOAuthUser {
  provider: OAuthProvider;
  providerUserId: string;
  email?: string | null;
  name?: string | null;
  avatar?: string | null;
  emailVerified?: boolean;
}

