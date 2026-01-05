import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoolController } from './pool.controller';
import { PoolService } from './pool.service';
import { PoolProduct, PoolHolding, Wallet, Coin } from '../../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([PoolProduct, PoolHolding, Wallet, Coin]),
  ],
  controllers: [PoolController],
  providers: [PoolService],
  exports: [PoolService],
})
export class PoolModule {}
