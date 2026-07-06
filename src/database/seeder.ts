import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ServiceCategory } from '../services/service-category.entity';
import { User } from '../users/user.entity';
import { seedServiceCategories } from './seeds/service-categories.seed';
import { seedTestUsers } from './seeds/test-users.seed';

// Minimal bootstrap module — only loads what the seeder needs
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [ServiceCategory, User],
        synchronize: false,  // Never auto-sync in seeder — tables already exist
      }),
    }),
    TypeOrmModule.forFeature([ServiceCategory]),
  ],
})
class SeederModule {}

async function bootstrap() {
  console.log('🌱 Starting FixIt DB seeder...\n');

  const app = await NestFactory.createApplicationContext(SeederModule, {
    logger: ['error', 'warn'],  // Suppress verbose Nest boot logs
  });

  const dataSource = app.get<DataSource>(getDataSourceToken());

  try {
    await seedServiceCategories(dataSource);
    await seedTestUsers(dataSource);
    console.log('\n✅ Seeding complete!');
  } catch (err) {
    console.error('\n❌ Seeding failed:', err);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
