import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../../domain/port/UserRepository';
import type { UserRegisterSchema } from '../dto/user/UserRegisterSchema';
import { compare, hash } from 'bcryptjs';
import type { UserLoginSchema } from '../dto/user/UserLoginSchema';
import type { UserLoginResponse } from '../dto/user/UserLoginResponse';
import { JwtService } from '@nestjs/jwt';
import { env } from '../../shared/env';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(userRegisterSchema: UserRegisterSchema): Promise<void> {
    const existing = await this.repository.existsByEmail(
      userRegisterSchema.email,
    );

    if (existing) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await hash(userRegisterSchema.password, 9);

    await this.repository.create({
      ...userRegisterSchema,
      password: hashedPassword,
    });
  }

  async login(credentials: UserLoginSchema): Promise<UserLoginResponse> {
    const user = await this.repository.findByEmail(credentials.email);

    if (!user || !user.password_hash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await compare(credentials.password, user.password_hash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = await this.signAccessToken({
      sub: user.id,
    });
    const { token: refreshToken } = await this.issueRefreshToken(user.id);
    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string): Promise<UserLoginResponse> {
    if (!refreshToken)
      throw new BadRequestException('Refresh token is required');

    const hash = this.hashToken(refreshToken);
    const token = await this.repository.findRefreshTokenByHash(hash);
    if (!token || token.revoked_at)
      throw new UnauthorizedException('Invalid or revoked refresh token');
    if (token.expires_at.getTime() <= Date.now())
      throw new UnauthorizedException('Refresh token expired');

    const accessToken = await this.signAccessToken({
      sub: token.user_id,
    });
    return { accessToken, refreshToken };
  }

  async logout(refreshToken: string): Promise<void> {
    if (!refreshToken)
      throw new BadRequestException('Refresh token is required');

    const hash = this.hashToken(refreshToken);
    const token = await this.repository.findRefreshTokenByHash(hash);
    if (!token || token.revoked_at)
      throw new UnauthorizedException('Invalid or revoked refresh token');

    await this.repository.revokeRefreshToken({
      tokenId: token.id,
      reason: 'logout',
    });
  }

  private async signAccessToken(payload: { sub: string }): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: env.JWT_ACCESS_SECRET,
      expiresIn: env.JWT_ACCESS_TTL,
    });
  }

  private async issueRefreshToken(
    userId: string,
  ): Promise<{ id: string; token: string }> {
    const token = randomBytes(64).toString('hex');
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + env.JWT_REFRESH_TTL * 1000);
    const created = await this.repository.createRefreshToken({
      userId,
      tokenHash,
      expiresAt,
    });
    return { id: created.id, token };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
