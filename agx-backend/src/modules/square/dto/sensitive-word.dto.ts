import { IsString, IsNumber, IsOptional, IsEnum, Min, Max } from 'class-validator';

/**
 * 敏感词创建 DTO
 */
export class CreateSensitiveWordDto {
  @IsString()
  word: string; // 敏感词

  @IsNumber()
  @Min(1)
  @Max(2)
  level: number; // 级别: 1-警告, 2-禁止

  @IsOptional()
  @IsNumber()
  status?: number; // 状态: 0-禁用, 1-启用
}

/**
 * 敏感词更新 DTO
 */
export class UpdateSensitiveWordDto {
  @IsOptional()
  @IsString()
  word?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(2)
  level?: number;

  @IsOptional()
  @IsNumber()
  status?: number;
}

/**
 * 帖子审核 DTO
 */
export class PostReviewDto {
  @IsNumber()
  postId: number; // 帖子ID

  @IsEnum(['approve', 'reject', 'modify'])
  action: 'approve' | 'reject' | 'modify'; // 操作: approve-通过, reject-拒绝, modify-修改

  @IsOptional()
  @IsString()
  reason?: string; // 审核原因
}
