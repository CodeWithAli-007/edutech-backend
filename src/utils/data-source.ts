
import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as config from 'config';

// Fallback to environment variables if config fails
let postgresConfig;
try {
  postgresConfig = config.get<{
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  }>('postgresConfig');
} catch (error) {
  // Fallback to environment variables
  postgresConfig = {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || 'edtechDB',
  };
}

export const AppDataSource = new DataSource({
  ...postgresConfig,
  type: 'postgres',
  synchronize: false, // if true will overright DB. Use migrations instead of synchronize in production
  logging: true,
  //migrationsRun: true, // Automatically run migrations on every application launch
  entities: ['src/entities/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/**/*{.ts,.js}'],
  subscribers: ['src/subscribers/**/*{.ts,.js}'],
});

// DataSource initialization is handled in app.ts
// This prevents double initialization
