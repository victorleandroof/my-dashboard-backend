import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import typeOrmConfig from './configs/typeorm.config.';
import { ExpenseModule } from './expense/expense.module';
import { TodoModule } from './todo/todo.module';
import { WeightModule } from './weight/weight.module';

const TYPEORM_CONFIG = 'database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
       inject: [ConfigService],
       useFactory: (config: ConfigService) => 
          config.get<TypeOrmModuleOptions>(TYPEORM_CONFIG)
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    AuthModule,
    TodoModule,
    ExpenseModule,
    WeightModule
  ],
})
export class AppModule {}
