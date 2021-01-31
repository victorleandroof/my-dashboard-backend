import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
import { ExpenseEntity } from './expense.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ExpenseEntity]), AuthModule],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}