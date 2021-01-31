import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfig } from 'src/configs/app.config';
import { join } from 'path';

const typeOrmConfig:TypeOrmModuleOptions = {
    type: 'postgres',
    host: AppConfig.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: AppConfig.DB_USER,
    password: AppConfig.DB_PASSWORD,
    database: AppConfig.DB_NAME,
    entities: [join(__dirname,'../**/*.entity{.ts,.js}')],
    migrationsRun: true,
    migrations: [join(__dirname, '../migration/**/*{.ts,.js}')],
    cli: {
        migrationsDir : 'src/migration'
    },
    logging: true,
    logger: 'file'
}

export default registerAs('database', () => ({
    config: typeOrmConfig
}))