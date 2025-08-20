import { Expose, Type } from 'class-transformer';
import { IsEnum, IsInt, IsString } from 'class-validator';

enum AppEnv {
  DEV = 'dev',
  PROD = 'prod',
  TEST = 'test',
}

export class EnvVarsSchema {
  @Expose()
  @Type(() => Number)
  @IsInt()
  PORT: number = 3000;

  @Expose()
  @IsEnum(AppEnv)
  NODE_ENV: AppEnv = AppEnv.DEV;

  @Expose()
  @IsString()
  JWT_ACCESS_SECRET: string = 'dev_access_secret_change_me';

  @Expose()
  @IsString()
  JWT_REFRESH_SECRET: string = 'dev_refresh_secret_change_me';

  @Expose()
  @Type(() => Number)
  @IsInt()
  JWT_ACCESS_TTL: number = 900;

  @Expose()
  @Type(() => Number)
  @IsInt()
  JWT_REFRESH_TTL: number = 2592000;
}
