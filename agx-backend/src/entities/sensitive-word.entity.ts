import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 敏感词表
 */
@Entity('agx_sensitive_words')
export class SensitiveWord {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 100, unique: true, comment: '敏感词' })
  word: string;

  @Column({ type: 'smallint', default: 1, comment: '级别: 1-警告, 2-禁止' })
  level: number;

  @Column({ type: 'smallint', default: 1, comment: '状态: 0-禁用, 1-启用' })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
