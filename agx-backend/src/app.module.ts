import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// 业务模块
import { AuthModule } from './modules/auth';
import { AccountModule } from './modules/account';
import { AdminModule } from './modules/admin';
import { PoolModule } from './modules/pool';
import { ContractModule } from './modules/contract';
import { AiModule } from './modules/ai';
import { MarketModule } from './modules/market/market.module';
import { SquareModule } from './modules/square/square.module';
import { InviteModule } from './modules/invite/invite.module';
import { GoldModule } from './modules/gold/gold.module';
import { SocialModule } from './modules/social/social.module';
import { SystemModule } from './modules/system/system.module';
import { TradeModule } from './modules/trade/trade.module';

// 实体
import {
  // 用户模块
  User,
  UserInvite,
  UserLevel,
  // 币种与钱包
  Admin,
  Coin,
  CoinChain,
  Wallet,
  AssetLog,
  Recharge,
  Withdraw,
  // 矿池模块
  PoolProduct,
  PoolHolding,
  // 合约模块
  ContractConfig,
  ContractOrder,
  // 行情模块（新增）
  Asset,
  AssetTicker,
  GoldPrice, GoldProduct,
  // 广场模块（新增）
  Post,
  Comment,
  Like,
  Follow,
  Topic,
  // 邀请与排行（新增）
  InviteReward,
  Rank,
  Commission,
  // 系统模块
  Kyc,
  Config,
  Notice,
  AdminLog,
  // 社交模块（新增）
  Friend,
  FriendRequest,
  Conversation,
  Message,
  SystemToggle,
  LevelPermission,
} from './entities';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // 数据库模块
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', '127.0.0.1'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'agx'),
        password: configService.get<string>('DB_PASSWORD', 'AGX2025Pass'),
        database: configService.get<string>('DB_DATABASE', 'agx'),
        entities: [
          // 用户模块
          User, UserInvite, UserLevel,
          // 币种与钱包
          Admin, Coin, CoinChain, Wallet, AssetLog, Recharge, Withdraw,
          // 矿池模块
          PoolProduct, PoolHolding,
          // 合约模块
          ContractConfig, ContractOrder,
          // 行情模块（新增）
          Asset, AssetTicker, GoldPrice, GoldProduct,
          // 广场模块（新增）
          Post, Comment, Like, Follow, Topic,
          // 邀请与排行（新增）
          InviteReward, Rank, Commission,
          // 系统模块
          Kyc, Config, Notice, AdminLog,
          // 社交模块（新增）
          Friend, FriendRequest, Conversation, Message, SystemToggle, LevelPermission,
        ],
        synchronize: false,
        logging: process.env.NODE_ENV !== 'production',
      }),
      inject: [ConfigService],
    }),
    // 业务模块
    AuthModule,
    AccountModule,
    AdminModule,
    PoolModule,
    ContractModule,
    AiModule,
    // 新增模块
    MarketModule,
    SquareModule,
    InviteModule,
    GoldModule,
    SocialModule,
    SystemModule,
    TradeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
