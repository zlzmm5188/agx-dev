import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SquareController } from './square.controller';
import { SquareService } from './square.service';
import { SensitiveWordService } from './sensitive-word.service';
import { ReviewService } from './review.service';
import { PrivateMessageService } from './private-message.service';
import { Post, Comment, Like, Follow, Topic, User, SensitiveWord, PostReview, PrivateMessage } from '../../entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Comment, Like, Follow, Topic, User, SensitiveWord, PostReview, PrivateMessage]),
    AuthModule,
  ],
  controllers: [SquareController],
  providers: [SquareService, SensitiveWordService, ReviewService, PrivateMessageService],
  exports: [SquareService, SensitiveWordService, ReviewService, PrivateMessageService],
})
export class SquareModule {}
