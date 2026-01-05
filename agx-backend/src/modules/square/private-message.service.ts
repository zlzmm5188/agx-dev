import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { PrivateMessage } from '../../entities';

@Injectable()
export class PrivateMessageService {
  constructor(
    @InjectRepository(PrivateMessage)
    private privateMessageRepository: Repository<PrivateMessage>,
  ) {}

  /**
   * 获取两个用户之间的私信记录
   */
  async getUserMessages(userId1: number, userId2: number, page: number = 1, pageSize: number = 20) {
    const [list, total] = await this.privateMessageRepository.findAndCount({
      where: [
        { senderId: userId1, receiverId: userId2, status: 1 },
        { senderId: userId2, receiverId: userId1, status: 1 }
      ],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { list, total, page, pageSize };
  }

  /**
   * 获取所有私信记录（管理后台用）
   */
  async getAllMessages(page: number = 1, pageSize: number = 20, startDate?: string, endDate?: string) {
    const where: any = { status: Between(0, 1) }; // 只显示正常和撤回的消息，不显示删除的
    
    if (startDate && endDate) {
      where.createdAt = Between(new Date(startDate), new Date(endDate));
    }

    const [list, total] = await this.privateMessageRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { list, total, page, pageSize };
  }

  /**
   * 获取用户未读消息数
   */
  async getUnreadCount(userId: number) {
    const count = await this.privateMessageRepository.count({
      where: { receiverId: userId, isRead: 0, status: 1 }
    });
    return count;
  }

  /**
   * 标记消息为已读
   */
  async markAsRead(senderId: number, receiverId: number) {
    await this.privateMessageRepository.update(
      { senderId, receiverId, isRead: 0 },
      { isRead: 1 }
    );
  }
}
