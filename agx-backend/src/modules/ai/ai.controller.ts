import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatDto } from './ai.dto';

@Controller('api/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /**
   * AI对话
   */
  @Post('chat')
  async chat(@Body() dto: ChatDto) {
    return this.aiService.chat(dto);
  }

  /**
   * 获取快捷问题
   */
  @Get('questions')
  getQuickQuestions(@Query('language') language?: string) {
    return this.aiService.getQuickQuestions(language || 'zh-CN');
  }
}
