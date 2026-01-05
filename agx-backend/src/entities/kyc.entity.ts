import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('agx_kyc')
export class Kyc {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 50, name: 'real_name', comment: '真实姓名' })
  realName: string;

  @Column({ type: 'varchar', length: 50, name: 'id_number', comment: '证件号码' })
  idNumber: string;

  @Column({ type: 'smallint', name: 'id_type', default: 1, comment: '证件类型: 1身份证 2护照' })
  idType: number;

  @Column({ type: 'varchar', length: 255, name: 'front_image', nullable: true, comment: '证件正面照' })
  frontImage: string;

  @Column({ type: 'varchar', length: 255, name: 'back_image', nullable: true, comment: '证件背面照' })
  backImage: string;

  @Column({ type: 'varchar', length: 255, name: 'hold_image', nullable: true, comment: '手持证件照' })
  holdImage: string;

  @Column({ type: 'smallint', default: 0, comment: '状态: 0待审核 1通过 2拒绝' })
  status: number;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '审核备注' })
  remark: string;

  @Column({ type: 'timestamp', nullable: true, name: 'reviewed_at', comment: '审核时间' })
  reviewedAt: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
