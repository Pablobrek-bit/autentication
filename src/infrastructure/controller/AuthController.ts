import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../../application/service/AuthService';
import { UserRegisterSchema } from '../../application/dto/user/UserRegisterSchema';
import { UserLoginSchema } from '../../application/dto/user/UserLoginSchema';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST /auth/register — cria usuário local (email+senha).
  @Post('register')
  async register(@Body() userRegisterSchema: UserRegisterSchema) {
    await this.authService.register(userRegisterSchema);
    return {
      message: 'User created successfully',
    };
  }

  // POST /auth/login — login local (retorna access token + refresh token cookie/valor).
  @Post('login')
  async login(@Body() body: UserLoginSchema) {
    const tokens = await this.authService.login(body);
    return tokens;
  }

  // POST /auth/refresh — troca refresh token por novo access (+ novo refresh — rotation).
  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    const tokens = await this.authService.refresh(refreshToken);
    return tokens;
  }

  // POST /auth/logout — revoga refresh token (logout).
  @Post('logout')
  async logout(@Body('refreshToken') refreshToken: string) {
    await this.authService.logout(refreshToken);
    return { message: 'Logged out' };
  }

  // GET /auth/oauth/google — inicia fluxo OAuth (redirect para Google)
  @Get('oauth/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // O guard faz o redirect para o Google automaticamente
  }

  // GET /auth/oauth/google/callback — retorno do Google
  @Get('oauth/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req) {
    const tokens = await this.authService.oauthLogin(req.user.userId);
    return tokens;
  }

  // GET /auth/me — retorna dados do usuário autenticado (protected by JWT).
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req) {
    return req.user;
  }
}
