import { Controller, Get, Post, Body, Query, Param, UseGuards, Req } from '@nestjs/common';
import { SocialService } from './social.service';

/**
 * 社交模块接口
 */
@Controller('api')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  // ========== 用户端接口 ==========

  @Post('user/follow/:targetId')
  async follow(@Req() req, @Param('targetId') targetId: number) {
    const userId = req.user?.id || 1; // Mock
    return this.socialService.follow(userId, targetId);
  }

  @Post('user/unfollow/:targetId')
  async unfollow(@Req() req, @Param('targetId') targetId: number) {
    const userId = req.user?.id || 1;
    return this.socialService.unfollow(userId, targetId);
  }

  @Get('user/friends')
  async getFriends(@Req() req, @Query('page') page = 1, @Query('limit') limit = 20) {
    const userId = req.user?.id || 1;
    return this.socialService.getFriends(userId, +page, +limit);
  }

  @Post('user/friend-request')
  async sendFriendRequest(
    @Req() req,
    @Body('targetId') targetId: number,
    @Body('message') message?: string,
  ) {
    const userId = req.user?.id || 1;
    return this.socialService.sendFriendRequest(userId, targetId, message);
  }

  @Post('user/friend-request/:requestId/handle')
  async handleFriendRequest(
    @Req() req,
    @Param('requestId') requestId: number,
    @Body('accept') accept: boolean,
  ) {
    const userId = req.user?.id || 1;
    return this.socialService.handleFriendRequest(userId, requestId, accept);
  }

  @Get('user/conversations')
  async getConversations(@Req() req, @Query('page') page = 1, @Query('limit') limit = 20) {
    const userId = req.user?.id || 1;
    return this.socialService.getConversations(userId, +page, +limit);
  }

  @Get('user/conversations/:conversationId/messages')
  async getMessages(
    @Req() req,
    @Param('conversationId') conversationId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    const userId = req.user?.id || 1;
    return this.socialService.getMessages(userId, conversationId, +page, +limit);
  }

  @Post('user/messages/send')
  async sendMessage(
    @Req() req,
    @Body('receiverId') receiverId: number,
    @Body('content') content: string,
    @Body('msgType') msgType = 1,
  ) {
    const userId = req.user?.id || 1;
    return this.socialService.sendMessage(userId, receiverId, content, msgType);
  }

  // ========== 管理端接口 ==========

  @Get('admin/social/friends')
  async adminGetFriendRelations(@Query() query) {
    return this.socialService.adminGetFriendRelations(query);
  }

  @Post('admin/social/remove-friend')
  async adminRemoveFriend(@Body('userAId') userAId: number, @Body('userBId') userBId: number) {
    return this.socialService.adminRemoveFriend(userAId, userBId);
  }

  @Post('admin/social/user/:userId/social-status')
  async adminSetUserSocialStatus(
    @Param('userId') userId: number,
    @Body('status') status: number,
  ) {
    return this.socialService.adminSetUserSocialStatus(userId, status);
  }

  @Post('admin/social/user/:userId/mute')
  async adminMuteUser(
    @Param('userId') userId: number,
    @Body('until') until: string,
  ) {
    return this.socialService.adminMuteUser(userId, new Date(until));
  }

  @Post('admin/social/user/:userId/can-be-friended')
  async adminSetUserCanBeFriended(
    @Param('userId') userId: number,
    @Body('canBeFriended') canBeFriended: number,
  ) {
    return this.socialService.adminSetUserCanBeFriended(userId, canBeFriended);
  }

  @Post('admin/social/user/:userId/can-chat')
  async adminSetUserCanChat(
    @Param('userId') userId: number,
    @Body('canChat') canChat: number,
  ) {
    return this.socialService.adminSetUserCanChat(userId, canChat);
  }
}
