import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemToggle, LevelPermission, Config } from '../../entities';

@Injectable()
export class SystemService {
  constructor(
    @InjectRepository(SystemToggle)
    private readonly toggleRepo: Repository<SystemToggle>,
    @InjectRepository(LevelPermission)
    private readonly permissionRepo: Repository<LevelPermission>,
    @InjectRepository(Config)
    private readonly configRepo: Repository<Config>,
  ) {}

  // ========== 功能开关 ==========
  async getToggles(module?: string): Promise<SystemToggle[]> {
    const where = module ? { module } : {};
    return this.toggleRepo.find({ where, order: { module: 'ASC', sort: 'ASC' } });
  }

  async updateToggle(key: string, enabled: number, updatedBy?: number): Promise<any> {
    await this.toggleRepo.update({ key }, { enabled, updatedBy });
    return { success: true };
  }

  async batchUpdateToggles(toggles: { key: string; enabled: number }[], updatedBy?: number): Promise<any> {
    for (const t of toggles) {
      await this.toggleRepo.update({ key: t.key }, { enabled: t.enabled, updatedBy });
    }
    return { success: true };
  }

  async createToggle(data: Partial<SystemToggle>): Promise<SystemToggle> {
    const toggle = this.toggleRepo.create(data);
    return this.toggleRepo.save(toggle);
  }

  async deleteToggle(key: string): Promise<any> {
    await this.toggleRepo.delete({ key });
    return { success: true };
  }

  // ========== 等级权限矩阵 ==========
  async getPermissions(level?: number): Promise<LevelPermission[]> {
    const where = level ? { level } : {};
    return this.permissionRepo.find({ where, order: { level: 'ASC', permissionKey: 'ASC' } });
  }

  async getPermissionMatrix(): Promise<any> {
    const permissions = await this.permissionRepo.find({ order: { level: 'ASC', permissionKey: 'ASC' } });

    // 按权限键分组
    const matrix: Record<string, Record<number, any>> = {};
    const permKeys = new Set<string>();
    const levels = [1, 2, 3, 4, 5]; // 普通、银牌、金牌、钻石、黑金

    permissions.forEach((p) => {
      permKeys.add(p.permissionKey);
      if (!matrix[p.permissionKey]) {
        matrix[p.permissionKey] = {};
      }
      matrix[p.permissionKey][p.level] = {
        allowed: p.allowed,
        limitValue: p.limitValue,
        name: p.permissionName,
      };
    });

    return {
      levels: levels.map((l) => ({ level: l, name: this.getLevelName(l) })),
      permissions: Array.from(permKeys).map((key) => ({
        key,
        name: matrix[key]?.[1]?.name || key,
        levels: levels.map((l) => ({
          level: l,
          allowed: matrix[key]?.[l]?.allowed ?? 1,
          limitValue: matrix[key]?.[l]?.limitValue,
        })),
      })),
    };
  }

  private getLevelName(level: number): string {
    const names = { 1: '普通', 2: '银牌', 3: '金牌', 4: '钻石', 5: '黑金' };
    return names[level] || `等级${level}`;
  }

  async updatePermission(level: number, permissionKey: string, data: Partial<LevelPermission>): Promise<any> {
    const existing = await this.permissionRepo.findOne({ where: { level, permissionKey } });
    if (existing) {
      await this.permissionRepo.update({ id: existing.id }, data);
    } else {
      const perm = this.permissionRepo.create({
        level,
        permissionKey,
        permissionName: data.permissionName || permissionKey,
        allowed: data.allowed ?? 1,
        limitValue: data.limitValue,
      });
      await this.permissionRepo.save(perm);
    }
    return { success: true };
  }

  async batchUpdatePermissions(permissions: { level: number; permissionKey: string; allowed: number; limitValue?: number }[]): Promise<any> {
    for (const p of permissions) {
      await this.updatePermission(p.level, p.permissionKey, p);
    }
    return { success: true };
  }

  // ========== 初始化默认开关和权限 ==========
  async initDefaultToggles(): Promise<any> {
    const defaults = [
      // 社交模块
      { key: 'allow_post', name: '允许发帖', module: 'social', enabled: 1, description: '是否允许用户发帖', sort: 1 },
      { key: 'allow_comment', name: '允许评论', module: 'social', enabled: 1, description: '是否允许用户评论', sort: 2 },
      { key: 'allow_like', name: '允许点赞', module: 'social', enabled: 1, description: '是否允许用户点赞', sort: 3 },
      { key: 'allow_add_friend', name: '允许加好友', module: 'social', enabled: 1, description: '是否允许用户加好友', sort: 4 },
      { key: 'allow_chat', name: '允许私聊', module: 'social', enabled: 1, description: '是否允许好友私聊', sort: 5 },
      // 交易模块
      { key: 'allow_spot_trade', name: '允许现货交易', module: 'trade', enabled: 1, description: '现货交易开关', sort: 1 },
      { key: 'allow_contract_trade', name: '允许合约交易', module: 'trade', enabled: 1, description: '合约交易开关', sort: 2 },
      { key: 'allow_gold_trade', name: '允许黄金交易', module: 'trade', enabled: 1, description: '黄金交易开关', sort: 3 },
      // 资产模块
      { key: 'allow_recharge', name: '允许充值', module: 'asset', enabled: 1, description: '充值功能开关', sort: 1 },
      { key: 'allow_withdraw', name: '允许提现', module: 'asset', enabled: 1, description: '提现功能开关', sort: 2 },
      { key: 'allow_transfer', name: '允许划转', module: 'asset', enabled: 1, description: '资产划转开关', sort: 3 },
    ];

    for (const d of defaults) {
      const existing = await this.toggleRepo.findOne({ where: { key: d.key } });
      if (!existing) {
        await this.toggleRepo.save(this.toggleRepo.create(d));
      }
    }

    return { success: true, message: '默认开关初始化完成' };
  }

  async initDefaultPermissions(): Promise<any> {
    const permKeys = [
      { key: 'can_post', name: '可以发帖' },
      { key: 'can_comment', name: '可以评论' },
      { key: 'can_add_friend', name: '可以加好友' },
      { key: 'can_chat', name: '可以私聊' },
      { key: 'daily_post_limit', name: '每日发帖上限' },
      { key: 'friend_limit', name: '好友数量上限' },
    ];

    const levelConfigs = [
      { level: 1, dailyPost: 5, friendLimit: 100 },
      { level: 2, dailyPost: 10, friendLimit: 200 },
      { level: 3, dailyPost: 20, friendLimit: 500 },
      { level: 4, dailyPost: 50, friendLimit: 1000 },
      { level: 5, dailyPost: 100, friendLimit: 5000 },
    ];

    for (const lc of levelConfigs) {
      for (const pk of permKeys) {
        const existing = await this.permissionRepo.findOne({
          where: { level: lc.level, permissionKey: pk.key },
        });
        if (!existing) {
          let limitValue = null;
          if (pk.key === 'daily_post_limit') limitValue = lc.dailyPost;
          if (pk.key === 'friend_limit') limitValue = lc.friendLimit;

          await this.permissionRepo.save(
            this.permissionRepo.create({
              level: lc.level,
              permissionKey: pk.key,
              permissionName: pk.name,
              allowed: 1,
              limitValue,
            }),
          );
        }
      }
    }

    return { success: true, message: '默认权限矩阵初始化完成' };
  }
}
