import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('agx_notice')
export class Notice {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 200, comment: '标题' })
  title: string;

  @Column({ type: 'text', comment: '内容' })
  content: string;

  @Column({ type: 'varchar', length: 20, default: 'notice', comment: '类型: notice/announcement/popup' })
  type: string;

  @Column({ type: 'smallint', default: 1, comment: '状态: 0禁用 1启用' })
  status: number;

  @Column({ type: 'int', default: 0, name: 'sort_order', comment: '排序' })
  sortOrder: number;

  @Column({ type: 'timestamp', nullable: true, name: 'start_at', comment: '开始时间' })
  startAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'end_at', comment: '结束时间' })
  endAt: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
