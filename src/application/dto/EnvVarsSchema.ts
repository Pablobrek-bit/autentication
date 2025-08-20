import { Expose, Type } from 'class-transformer';
import { IsEnum, IsInt } from 'class-validator';

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
}
