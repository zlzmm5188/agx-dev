import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';
import { User, UserInvite, UserLevel, InviteReward, Commission, Rank } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserInvite, UserLevel, InviteReward, Commission, Rank])],
  controllers: [InviteController],
  providers: [InviteService],
  exports: [InviteService],
})
export class InviteModule {}
