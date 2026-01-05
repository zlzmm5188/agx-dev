import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { ContractConfig, ContractOrder, Wallet, Coin } from '../../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContractConfig, ContractOrder, Wallet, Coin]),
  ],
  controllers: [ContractController],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractModule {}
