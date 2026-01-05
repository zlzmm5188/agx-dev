import { Controller, Get, Post, Put, Delete, Body, Query, Param } from '@nestjs/common';
import { SystemService } from './system.service';

/**
 * 系统管理接口
 */
@Controller('api/admin/system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  // ========== 功能开关 ==========

  @Get('toggles')
  async getToggles(@Query('module') module?: string) {
    return this.systemService.getToggles(module);
  }

  @Put('toggles/:key')
  async updateToggle(
    @Param('key') key: string,
    @Body('enabled') enabled: number,
  ) {
    return this.systemService.updateToggle(key, enabled);
  }

  @Put('toggles')
  async batchUpdateToggles(@Body('toggles') toggles: { key: string; enabled: number }[]) {
    return this.systemService.batchUpdateToggles(toggles);
  }

  @Post('toggles')
  async createToggle(@Body() data: any) {
    return this.systemService.createToggle(data);
  }

  @Delete('toggles/:key')
  async deleteToggle(@Param('key') key: string) {
    return this.systemService.deleteToggle(key);
  }

  @Post('toggles/init')
  async initDefaultToggles() {
    return this.systemService.initDefaultToggles();
  }

  // ========== 等级权限矩阵 ==========

  @Get('permissions')
  async getPermissions(@Query('level') level?: number) {
    return this.systemService.getPermissions(level ? +level : undefined);
  }

  @Get('permissions/matrix')
  async getPermissionMatrix() {
    return this.systemService.getPermissionMatrix();
  }

  @Put('permissions')
  async updatePermission(
    @Body('level') level: number,
    @Body('permissionKey') permissionKey: string,
    @Body('allowed') allowed: number,
    @Body('limitValue') limitValue?: number,
  ) {
    return this.systemService.updatePermission(level, permissionKey, { allowed, limitValue });
  }

  @Put('permissions/batch')
  async batchUpdatePermissions(@Body('permissions') permissions: any[]) {
    return this.systemService.batchUpdatePermissions(permissions);
  }

  @Post('permissions/init')
  async initDefaultPermissions() {
    return this.systemService.initDefaultPermissions();
  }
}
