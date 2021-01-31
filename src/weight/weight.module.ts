import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WeightController } from './weight.controller';
import { WeightService } from './weight.service';
import { WeightEntity } from './weight.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([WeightEntity]), AuthModule],
  controllers: [WeightController],
  providers: [WeightService],
})
export class WeightModule {}