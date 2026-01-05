import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { AdminService } from './admin.service';
import {
  AdminLoginDto,
  CurrencyListDto,
  CreateCurrencyDto,
  UpdateCurrencyDto,
  UserListDto,
  UpdateUserStatusDto,
  PoolProductListDto,
  CreatePoolProductDto,
  UpdatePoolProductDto,
  ContractConfigListDto,
  CreateContractConfigDto,
  UpdateContractConfigDto,
} from './admin.dto';
import { AdminGuard } from '../auth/jwt-auth.guard';

@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * 管理员登录
   * POST /api/admin/login
   */
  @Post('login')
  async login(@Body() dto: AdminLoginDto, @Req() req: Request) {
    const ip = req.ip || req.socket.remoteAddress;
    return this.adminService.login(dto, ip);
  }

  /**
   * 获取币种列表
   * GET /api/admin/currency/list
   */
  @Get('currency/list')
  @UseGuards(AdminGuard)
  async getCurrencyList(@Query() dto: CurrencyListDto) {
    return this.adminService.getCurrencyList(dto);
  }

  /**
   * 新增币种
   * POST /api/admin/currency
   */
  @Post('currency')
  @UseGuards(AdminGuard)
  async createCurrency(@Body() dto: CreateCurrencyDto) {
    return this.adminService.createCurrency(dto);
  }

  /**
   * 更新币种
   * PUT /api/admin/currency/:id
   */
  @Put('currency/:id')
  @UseGuards(AdminGuard)
  async updateCurrency(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCurrencyDto,
  ) {
    return this.adminService.updateCurrency(id, dto);
  }

  /**
   * 删除币种
   * DELETE /api/admin/currency/:id
   */
  @Delete('currency/:id')
  @UseGuards(AdminGuard)
  async deleteCurrency(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteCurrency(id);
  }

  // ==================== 用户管理 ====================

  @Get('user/list')
  @UseGuards(AdminGuard)
  async getUserList(@Query() dto: UserListDto) {
    return this.adminService.getUserList(dto);
  }

  @Put('user/:id/status')
  @UseGuards(AdminGuard)
  async updateUserStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.adminService.updateUserStatus(id, dto);
  }

  // ==================== 矿池产品管理 ====================

  @Get('pool/list')
  @UseGuards(AdminGuard)
  async getPoolProductList(@Query() dto: PoolProductListDto) {
    return this.adminService.getPoolProductList(dto);
  }

  @Post('pool')
  @UseGuards(AdminGuard)
  async createPoolProduct(@Body() dto: CreatePoolProductDto) {
    return this.adminService.createPoolProduct(dto);
  }

  @Put('pool/:id')
  @UseGuards(AdminGuard)
  async updatePoolProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePoolProductDto,
  ) {
    return this.adminService.updatePoolProduct(id, dto);
  }

  @Delete('pool/:id')
  @UseGuards(AdminGuard)
  async deletePoolProduct(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deletePoolProduct(id);
  }

  // ==================== 秒合约配置管理 ====================

  @Get('contract/list')
  @UseGuards(AdminGuard)
  async getContractConfigList(@Query() dto: ContractConfigListDto) {
    return this.adminService.getContractConfigList(dto);
  }

  @Post('contract')
  @UseGuards(AdminGuard)
  async createContractConfig(@Body() dto: CreateContractConfigDto) {
    return this.adminService.createContractConfig(dto);
  }

  @Put('contract/:id')
  @UseGuards(AdminGuard)
  async updateContractConfig(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContractConfigDto,
  ) {
    return this.adminService.updateContractConfig(id, dto);
  }

  @Delete('contract/:id')
  @UseGuards(AdminGuard)
  async deleteContractConfig(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteContractConfig(id);
  }

  // ==================== 仪表盘 ====================

  @Get('dashboard/stats')
  @UseGuards(AdminGuard)
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('dashboard/pending')
  @UseGuards(AdminGuard)
  async getPendingList() {
    return this.adminService.getPendingList();
  }

  // ==================== 订单管理 ====================

  @Get('holding/list')
  @UseGuards(AdminGuard)
  async getPoolHoldingList(@Query() dto: any) {
    return this.adminService.getPoolHoldingList(dto);
  }

  @Get('order/list')
  @UseGuards(AdminGuard)
  async getContractOrderList(@Query() dto: any) {
    return this.adminService.getContractOrderList(dto);
  }

  @Put('order/:id/settle')
  @UseGuards(AdminGuard)
  async settleContractOrder(@Param('id', ParseIntPipe) id: number, @Body() dto: any, @Req() req: Request) {
    const adminId = (req as any).user?.sub || (req as any).user?.uid;
    const ip = req.ip || req.socket.remoteAddress;
    return this.adminService.settleContractOrder(id, dto, adminId, ip);
  }

  // ==================== KYC管理 ====================

  @Get('kyc/list')
  @UseGuards(AdminGuard)
  async getKycList(@Query() dto: any) {
    return this.adminService.getKycList(dto);
  }

  @Put('kyc/:id/review')
  @UseGuards(AdminGuard)
  async reviewKyc(@Param('id', ParseIntPipe) id: number, @Body() dto: any, @Req() req: Request) {
    const adminId = (req as any).user?.sub || (req as any).user?.uid;
    const ip = req.ip || req.socket.remoteAddress;
    return this.adminService.reviewKyc(id, dto, adminId, ip);
  }

  // ==================== 充值记录 ====================

  @Get('recharge/list')
  @UseGuards(AdminGuard)
  async getRechargeList(@Query() dto: any) {
    return this.adminService.getRechargeList(dto);
  }

  @Post('recharge/manual')
  @UseGuards(AdminGuard)
  async manualRecharge(@Body() dto: any, @Req() req: Request) {
    const adminId = (req as any).user?.sub || (req as any).user?.uid;
    const ip = req.ip || req.socket.remoteAddress;
    return this.adminService.manualRecharge(dto, adminId, ip);
  }

  // ==================== 提现管理 ====================

  @Get('withdraw/list')
  @UseGuards(AdminGuard)
  async getWithdrawList(@Query() dto: any) {
    return this.adminService.getWithdrawList(dto);
  }

  @Put('withdraw/:id/review')
  @UseGuards(AdminGuard)
  async reviewWithdraw(@Param('id', ParseIntPipe) id: number, @Body() dto: any, @Req() req: Request) {
    const adminId = (req as any).user?.sub || (req as any).user?.uid;
    const ip = req.ip || req.socket.remoteAddress;
    return this.adminService.reviewWithdraw(id, dto, adminId, ip);
  }

  // ==================== 用户资产管理 ====================

  @Get('user/:id/assets')
  @UseGuards(AdminGuard)
  async getUserAssets(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getUserAssets(id);
  }

  @Post('user/:id/asset/adjust')
  @UseGuards(AdminGuard)
  async adjustUserAsset(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.adminService.adjustUserAsset(id, dto);
  }

  @Get('asset/logs')
  @UseGuards(AdminGuard)
  async getAssetLogs(@Query() dto: any) {
    return this.adminService.getAssetLogs(dto);
  }

  // ==================== 系统配置 ====================

  @Get('config/list')
  @UseGuards(AdminGuard)
  async getConfigList(@Query() dto: any) {
    return this.adminService.getConfigList(dto);
  }

  @Put('config/:key')
  @UseGuards(AdminGuard)
  async updateConfig(@Param('key') key: string, @Body() dto: any) {
    return this.adminService.updateConfig(key, dto);
  }

  @Post('config/batch')
  @UseGuards(AdminGuard)
  async batchUpdateConfigs(@Body() dto: any) {
    return this.adminService.batchUpdateConfigs(dto.configs || []);
  }

  // ==================== 公告管理 ====================

  @Get('notice/list')
  @UseGuards(AdminGuard)
  async getNoticeList(@Query() dto: any) {
    return this.adminService.getNoticeList(dto);
  }

  @Post('notice')
  @UseGuards(AdminGuard)
  async createNotice(@Body() dto: any) {
    return this.adminService.createNotice(dto);
  }

  @Put('notice/:id')
  @UseGuards(AdminGuard)
  async updateNotice(@Param('id') id: number, @Body() dto: any) {
    return this.adminService.updateNotice(id, dto);
  }

  @Delete('notice/:id')
  @UseGuards(AdminGuard)
  async deleteNotice(@Param('id') id: number) {
    return this.adminService.deleteNotice(id);
  }

  // ==================== 币种链管理 ====================

  @Get('chain/list')
  @UseGuards(AdminGuard)
  async getCoinChainList(@Query('coinId') coinId?: number) {
    return this.adminService.getCoinChainList(coinId);
  }

  @Post('chain')
  @UseGuards(AdminGuard)
  async createCoinChain(@Body() dto: any) {
    return this.adminService.createCoinChain(dto);
  }

  @Put('chain/:id')
  @UseGuards(AdminGuard)
  async updateCoinChain(@Param('id') id: number, @Body() dto: any) {
    return this.adminService.updateCoinChain(id, dto);
  }

  @Delete('chain/:id')
  @UseGuards(AdminGuard)
  async deleteCoinChain(@Param('id') id: number) {
    return this.adminService.deleteCoinChain(id);
  }

  // ==================== 邀请管理 ====================

  @Get('invite/list')
  @UseGuards(AdminGuard)
  async getInviteList(@Query() dto: any) {
    return this.adminService.getInviteList(dto);
  }

  // ==================== 返佣管理 ====================

  @Get('commission/list')
  @UseGuards(AdminGuard)
  async getCommissionList(@Query() dto: any) {
    return this.adminService.getCommissionList(dto);
  }

  // ==================== 操作日志 ====================

  @Get('log/list')
  @UseGuards(AdminGuard)
  async getAdminLogList(@Query() dto: any) {
    return this.adminService.getAdminLogList(dto);
  }
}
