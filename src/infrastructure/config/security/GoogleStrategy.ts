import { PassportStrategy } from '@nestjs/passport';
import { Strategy, type Profile } from 'passport-google-oauth20';
import { AuthService } from '../../../application/service/AuthService';
import { env } from '../../../shared/env';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: env.OAUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.OAUTH_GOOGLE_CLIENT_SECRET,
      callbackURL: env.OAUTH_GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
      state: false,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log('Google profile:', profile);
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);

    const provider = 'google';
    const providerUserId = profile.id;
    const email = profile.emails?.[0].value ?? null;
    const fullName = profile.displayName ?? null;
  }
}
