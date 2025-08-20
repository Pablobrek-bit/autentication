import { Controller } from '@nestjs/common';
import { AuthService } from '../../application/service/AuthService';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST /auth/register — cria usuário local (email+senha).

  // POST /auth/login — login local (retorna access token + refresh token cookie/valor).

  // POST /auth/refresh — troca refresh token por novo access (+ novo refresh — rotation).

  // POST /auth/logout — revoga refresh token (logout).

  // GET /auth/oauth/:provider — inicia fluxo OAuth (redirect).

  // GET /auth/oauth/:provider/callback — callback do provedor (cria/associa user e emite tokens).

  // POST /auth/link/:provider — (opcional) linkar conta social para usuário logado (pode usar redirect OAuth).

  // User (protegidas)

  // GET /users/me — retorna dados do usuário autenticado (protected by JWT).

  // GET /users/:id / outros endpoints de usuário conforme necessidade (RBAC/guards).
}
