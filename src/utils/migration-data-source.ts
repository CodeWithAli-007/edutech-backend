import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

// Direct environment variable access for TypeORM CLI
const MigrationDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'edtechDB',
  synchronize: false,
  logging: true,
  entities: ['src/entities/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/**/*{.ts,.js}'],
  subscribers: ['src/subscribers/**/*{.ts,.js}'],
});

// Export default for TypeORM CLI compatibility (only one export allowed)
export default MigrationDataSource;
