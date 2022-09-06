import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.get<string>('TYPEORM_HOST'),
      port: this.config.get<number>('TYPEORM_PORT'),
      database: this.config.get<string>('TYPEORM_DATABASE'),
      username: this.config.get<string>('TYPEORM_USERNAME'),
      password: this.config.get<string>('TYPEORM_PASSWORD'),
      autoLoadEntities: true,
      migrations: ['dist/database/migrations/*.{ts,js}'],
      migrationsTableName: 'typeorm_migrations',
      logger: 'file',
      synchronize: true, // never use TRUE in production!
    };
  }
}
