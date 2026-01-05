import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SquareController } from './square.controller';
import { SquareService } from './square.service';
import { Post, Comment, Like, Follow, Topic, User } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Comment, Like, Follow, Topic, User])],
  controllers: [SquareController],
  providers: [SquareService],
  exports: [SquareService],
})
export class SquareModule {}
