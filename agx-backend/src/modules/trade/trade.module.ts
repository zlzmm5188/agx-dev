import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradeController, TradeAdminController } from './trade.controller';
import { TradeService } from './trade.service';
import { TradingPair, SpotOrder, CoinIssue, CoinSubscription, Wallet } from '../../entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TradingPair, SpotOrder, CoinIssue, CoinSubscription, Wallet]),
    AuthModule,
  ],
  controllers: [TradeController, TradeAdminController],
  providers: [TradeService],
  exports: [TradeService],
})
export class TradeModule {}
