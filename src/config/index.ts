import dotenv from 'dotenv';

// Load Configuration File
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: 'config/.env.test.local' });
} else {
  dotenv.config({ path: 'config/.env' });
}

const config = {
  PORT: parseInt(process.env.PORT!, 10) || 8000,
  NODE_ENV: (process.env.NODE_ENV = process.env.NODE_ENV || 'development'),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  CORS_WHITELIST: (process.env.CORS_WHITELIST || '').split(','),
  DATABASE: {
    URI: process.env.DATABASE_URI!,
    PASSWORD: process.env.DATABASE_PASSWORD!,
  },
  AUTH: {
    PEPPER: process.env.PEPPER!,
    SALT_ROUNDS: process.env.SALT_ROUNDS!,
  },
};

export default config;
