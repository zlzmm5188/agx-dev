import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin, Coin, CoinChain, User, UserInvite, PoolProduct, ContractConfig, PoolHolding, ContractOrder, Kyc, Recharge, Withdraw, AssetLog, Config, Wallet, Notice, Commission, AdminLog } from '../../entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, Coin, CoinChain, User, UserInvite, PoolProduct, ContractConfig, PoolHolding, ContractOrder, Kyc, Recharge, Withdraw, AssetLog, Config, Wallet, Notice, Commission, AdminLog]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule implements OnModuleInit {
  constructor(private readonly adminService: AdminService) {}

  async onModuleInit() {
    // 确保默认管理员存在
    await this.adminService.ensureDefaultAdmin();
  }
}
