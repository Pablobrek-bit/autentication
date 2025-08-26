<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

# Authentication API 🚀

[![NestJS](https://img.shields.io/badge/NestJS-11.x-red)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-blue)](https://www.prisma.io/)
[![Passport](https://img.shields.io/badge/Passport-JWT%20%7C%20Google%20OAuth2-brightgreen)](http://www.passportjs.org/)
[![License](https://img.shields.io/badge/License-UNLICENSED-lightgrey)](LICENSE)

API REST de autenticação com NestJS, JWT (access + refresh), OAuth2 (Google) e limpeza automática de refresh tokens. Inclui Guards JWT, validação com DTOs e repositórios Prisma.

---

## 📋 Tabela de Conteúdos

- [Funcionalidades](#-funcionalidades)
- [Endpoints da API](#-endpoints-da-api)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Comandos Disponíveis](#-comandos-disponíveis)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contribuição](#-contribuição)

---

## 🌟 Funcionalidades

### Funcionalidades Principais

- Autenticação local: email + senha → access token (JWT) e refresh token persistido (hash SHA-256).
- Logout: revogação de refresh token (idempotente).
- OAuth2 Google: social login com criação/vinculação de conta.
- Rotas protegidas por JWT Guard (Bearer token).

### Recursos Adicionais

- Limpeza automática de tokens expirados/revogados (cron job horário com @nestjs/schedule).
- Validação de DTOs (class-validator) e pipes globais.
- Repositórios Prisma (User, RefreshToken, OAuthAccount) e índices úteis.

---

## 🔌 Endpoints da API

### Auth

- POST `/auth/register` — cria usuário (email/senha).
- POST `/auth/login` — gera accessToken + refreshToken.
- POST `/auth/refresh` — emite novo accessToken (mantém o mesmo refresh). Body: `{ "refreshToken": "..." }`.
- POST `/auth/logout` — revoga o refreshToken informado. Body: `{ "refreshToken": "..." }`.
- GET `/auth/oauth/google` — inicia OAuth (redirect para Google).
- GET `/auth/oauth/google/callback` — callback do Google, retorna tokens.
- GET `/auth/me` — rota protegida, retorna `req.user` do JWT.

Para detalhes, consulte `src/infrastructure/controller/AuthController.ts`.

---

## 🛠️ Tecnologias Utilizadas

| Categoria        | Tecnologias                                                            |
| ---------------- | ---------------------------------------------------------------------- |
| Backend          | NestJS 11.x, TypeScript 5.x                                            |
| Auth             | @nestjs/jwt, passport, passport-jwt, passport-google-oauth20, bcryptjs |
| Banco de Dados   | PostgreSQL, Prisma ORM 6.x                                             |
| Jobs/Scheduling  | @nestjs/schedule                                                       |
| Validação/Config | class-validator, class-transformer, dotenv                             |
| Dev/Test         | Jest, Supertest, ESLint, Prettier                                      |
| Container        | Docker, Docker Compose                                                 |

---

## 🏗️ Estrutura do Projeto

Arquitetura modular com camadas Application/Domain/Infrastructure (ports & adapters).

```
src/
  application/
    dto/
      commum/EnvVarsSchema.ts
      user/ (Login/Register DTOs)
    service/
      AuthService.ts
      RefreshTokenService.ts
      OAuthAccountService.ts
      PrismaService.ts
  domain/
    port/ (UserRepository, RefreshTokenRepository, OAuthAccountRepository)
  infrastructure/
    config/
      job/CleanupRefreshTokensJob.ts
      security/JwtStrategy.ts
      security/GoogleStrategy.ts
    controller/AuthController.ts
    modules/ (AuthModule, PrismaModule, OAuthAccountModule, RefreshTokenModule)
    persistence/ (Prisma*Repository.ts)
  app.module.ts
  main.ts
prisma/
  schema.prisma
  migrations/
```

---

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+ (recomendado)
- Docker e Docker Compose (para o Postgres)
- NPM

### Passo a Passo

1. Clone o repositório

```
git clone https://github.com/Pablobrek-bit/autentication.git
cd autentication
```

2. Configure as variáveis de ambiente

- Copie `.env.example` para `.env` e preencha os valores (veja [Variáveis de Ambiente](#-variáveis-de-ambiente)).

3. Suba o banco de dados (Docker)

```
docker-compose up -d autentication_db
```

4. Instale as dependências

```
npm install
```

5. Execute as migrações do Prisma e gere o client

```
npx prisma migrate dev
npx prisma generate
```

6. Inicie o servidor NestJS (dev)

```
npm run start:dev
```

7. Acesse a API

- Local: http://localhost:3000
- Via Docker (se executar o app no compose): porta mapeada `3001:3000` → http://localhost:3001

---

## 📜 Comandos Disponíveis

| Comando                  | Descrição                                 |
| ------------------------ | ----------------------------------------- |
| `npm run build`          | Compila TypeScript para `dist`            |
| `npm run format`         | Formata com Prettier                      |
| `npm start`              | Inicia em modo produção (requer build)    |
| `npm run start:dev`      | Inicia em desenvolvimento com watch       |
| `npm run start:debug`    | Inicia com debug + watch                  |
| `npm run start:prod`     | Inicia a partir de `dist`                 |
| `npm run lint`           | ESLint com correção automática            |
| `npm test`               | Testes unitários                          |
| `npm run test:e2e`       | Testes end-to-end                         |
| `npx prisma migrate dev` | Cria/aplica migrações no banco            |
| `npx prisma studio`      | UI do Prisma para visualizar/editar dados |

---

## 🔧 Variáveis de Ambiente

Crie `.env` na raiz (baseado em `.env.example`):

```properties
# Ambiente
NODE_ENV=dev
PORT=3000

# Banco de Dados
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_db_name
# URL do Postgres usada pelo Prisma (schema.prisma usa DB_URL)
DB_URL=postgresql://your_user:your_password@localhost:5432/your_db_name

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_TTL=900          # 15 min (segundos)
JWT_REFRESH_TTL=2592000     # 30 dias (segundos)

# OAuth (Google)
OAUTH_GOOGLE_CLIENT_ID=your_google_client_id
OAUTH_GOOGLE_CLIENT_SECRET=your_google_client_secret
OAUTH_GOOGLE_CALLBACK_URL=http://localhost:3000/auth/oauth/google/callback
```

Observações:

- Access token curto (JWT_ACCESS_TTL) + refresh longo (JWT_REFRESH_TTL).
- Refresh token é salvo como hash (SHA-256) em `RefreshToken.token_hash` (único).

---

## 🌐 Deployment

1. Atualize as variáveis de ambiente para produção (`NODE_ENV=prod`).
2. Build da aplicação:

```
npm run build
```

3. Migrações em produção:

```
npx prisma migrate deploy
```

4. Start em produção:

```
npm run start:prod
```

Opcional: use Docker para conteinerizar o app (veja `Dockerfile` e `docker-compose.yml`).

---

## 🔍 Troubleshooting

1. “Unknown authentication strategy 'jwt'”

- Garanta `JwtStrategy` como provider e `PassportModule.register({ defaultStrategy: 'jwt' })` no `AuthModule`.

2. “an unknown value was passed to the validate function” (400)

- Envie `Content-Type: application/json` e body JSON válido. Evite `import type` do DTO no controller.

3. OAuth Google retorna 401 ao iniciar

- Verifique `OAUTH_GOOGLE_*` no `.env` e a Redirect URI na Google Cloud (igual ao callback). Use `state: false` na strategy se não usar sessões.

4. Erros de banco (conexão/migração)

- Confirme `DB_URL` e se o container Postgres está saudável (`docker ps`, `docker logs`).

5. Injeção do repositório (UnknownDependencies)

- Use o mesmo token de provider/`@Inject` para o `UserRepository` ou as portas de repositório usadas.

6. Refresh/Logout

- Refresh sem rotação: `/auth/refresh` só emite novo access. Logout revoga o refresh; após expirar o access, será preciso logar novamente.

---

## 🤝 Contribuição

1. Fork
2. `git checkout -b feature/sua-feature`
3. Commit (`npm run lint` antes de enviar)
4. Push e abra um PR
