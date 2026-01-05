import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import {
  Friend,
  FriendRequest,
  Conversation,
  Message,
  Follow,
  User,
  SystemToggle,
  LevelPermission,
} from '../../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Friend,
      FriendRequest,
      Conversation,
      Message,
      Follow,
      User,
      SystemToggle,
      LevelPermission,
    ]),
  ],
  controllers: [SocialController],
  providers: [SocialService],
  exports: [SocialService],
})
export class SocialModule {}
