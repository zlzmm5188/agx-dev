import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoldController } from './gold.controller';
import { GoldService } from './gold.service';
import { GoldPrice, Config, GoldProduct } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([GoldPrice, Config, GoldProduct])],
  controllers: [GoldController],
  providers: [GoldService],
  exports: [GoldService],
})
export class GoldModule {}
