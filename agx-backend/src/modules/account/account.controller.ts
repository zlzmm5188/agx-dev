import { Controller, Post, Get, Put, Body, Query, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AccountService } from './account.service';
import { RegisterDto, LoginDto, ChangePasswordDto, UpdateProfileDto, SubmitKycDto, WithdrawDto, GetDepositAddressDto } from './account.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../common';

@Controller('api/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  /**
   * 用户注册
   * POST /api/account/register
   */
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.accountService.register(dto);
  }

  /**
   * 用户登录
   * POST /api/account/login
   */
  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const ip = req.ip || req.socket.remoteAddress;
    return this.accountService.login(dto, ip);
  }

  /**
   * 获取用户信息
   * GET /api/account/profile
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser('id') userId: number) {
    return this.accountService.getProfile(userId);
  }

  /**
   * 获取用户余额
   * GET /api/account/balance
   */
  @Get('balance')
  @UseGuards(JwtAuthGuard)
  async getBalance(@CurrentUser('id') userId: number) {
    return this.accountService.getBalance(userId);
  }

  /**
   * 修改密码
   * POST /api/account/password
   */
  @Post('password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@CurrentUser('id') userId: number, @Body() dto: ChangePasswordDto) {
    return this.accountService.changePassword(userId, dto);
  }

  /**
   * 更新用户信息
   * PUT /api/account/profile
   */
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@CurrentUser('id') userId: number, @Body() dto: UpdateProfileDto) {
    return this.accountService.updateProfile(userId, dto);
  }

  /**
   * 提交KYC认证
   * POST /api/account/kyc
   */
  @Post('kyc')
  @UseGuards(JwtAuthGuard)
  async submitKyc(@CurrentUser('id') userId: number, @Body() dto: SubmitKycDto) {
    return this.accountService.submitKyc(userId, dto);
  }

  /**
   * 获取KYC状态
   * GET /api/account/kyc
   */
  @Get('kyc')
  @UseGuards(JwtAuthGuard)
  async getKycStatus(@CurrentUser('id') userId: number) {
    return this.accountService.getKycStatus(userId);
  }

  /**
   * 获取充值地址
   * GET /api/account/deposit/address
   */
  @Get('deposit/address')
  @UseGuards(JwtAuthGuard)
  async getDepositAddress(@CurrentUser('id') userId: number, @Query() dto: GetDepositAddressDto) {
    return this.accountService.getDepositAddress(userId, dto);
  }

  /**
   * 获取充值记录
   * GET /api/account/deposit/history
   */
  @Get('deposit/history')
  @UseGuards(JwtAuthGuard)
  async getDepositHistory(@CurrentUser('id') userId: number, @Query() query: any) {
    return this.accountService.getDepositHistory(userId, query);
  }

  /**
   * 申请提现
   * POST /api/account/withdraw
   */
  @Post('withdraw')
  @UseGuards(JwtAuthGuard)
  async withdraw(@CurrentUser('id') userId: number, @Body() dto: WithdrawDto) {
    return this.accountService.withdraw(userId, dto);
  }

  /**
   * 获取提现记录
   * GET /api/account/withdraw/history
   */
  @Get('withdraw/history')
  @UseGuards(JwtAuthGuard)
  async getWithdrawHistory(@CurrentUser('id') userId: number, @Query() query: any) {
    return this.accountService.getWithdrawHistory(userId, query);
  }

  /**
   * 获取邀请列表
   * GET /api/account/invites
   */
  @Get('invites')
  @UseGuards(JwtAuthGuard)
  async getInviteList(@CurrentUser('id') userId: number, @Query() query: any) {
    return this.accountService.getInviteList(userId, query);
  }

  /**
   * 获取邀请统计
   * GET /api/account/invite/stats
   */
  @Get('invite/stats')
  @UseGuards(JwtAuthGuard)
  async getInviteStats(@CurrentUser('id') userId: number) {
    return this.accountService.getInviteStats(userId);
  }

  /**
   * 获取公告列表（无需登录）
   * GET /api/account/notices
   */
  @Get('notices')
  async getNotices() {
    return this.accountService.getActiveNotices();
  }
}
