import { plainToInstance } from 'class-transformer';
import { config } from 'dotenv';
import { EnvVarsSchema } from '../application/dto/commum/EnvVarsSchema';
import { validateSync } from 'class-validator';

config();

const env = plainToInstance(EnvVarsSchema, process.env, {
  enableImplicitConversion: true,
  excludeExtraneousValues: true,
});
const errors = validateSync(env, {
  whitelist: true,
  forbidNonWhitelisted: true,
});
if (errors.length > 0) {
  throw new Error(
    `Environment validation failed: ${errors.map((e) => e.toString()).join(', ')}`,
  );
}

export { env };
