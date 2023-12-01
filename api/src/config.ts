import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    postgres: {
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
      user: process.env.POSTGRES_USER || 'postgres',
      pass: process.env.POSTGRES_PASSWORD || 'culqi_pg',
    },
    redis: {
      url: process.env.REDIS_URL || 'redis://culqi-redis:6379',
    },
  };
});
