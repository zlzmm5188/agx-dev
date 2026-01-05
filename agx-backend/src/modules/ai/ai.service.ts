import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatDto } from './ai.dto';

@Injectable()
export class AiService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY', '');
    this.baseUrl = this.configService.get<string>('OPENAI_BASE_URL', 'https://api.openai.com/v1');
    this.model = this.configService.get<string>('OPENAI_MODEL', 'gpt-4o-mini');
  }

  private getSystemPrompt(language: string): string {
    const prompts: Record<string, string> = {
      'zh-CN': `你是 AGX 平台的智能投资顾问。
你可以：
- 解答用户关于矿池产品、秒合约交易的问题
- 提供投资建议（但要提示风险）
- 说明平台功能使用方法
请用专业但友好的语气回答，使用中文。`,
      'en': `You are the AI investment advisor for AGX platform.
You can:
- Answer questions about mining pool products and second contracts trading
- Provide investment advice (with risk warnings)
- Explain platform features
Please respond professionally and friendly in English.`,
    };
    return prompts[language] || prompts['zh-CN'];
  }

  async chat(dto: ChatDto): Promise<{ reply: string }> {
    if (!this.apiKey) {
      return { reply: '抱歉，AI助手暂时不可用，请稍后再试。' };
    }

    const messages = [
      { role: 'system', content: this.getSystemPrompt(dto.language || 'zh-CN') },
    ];

    // 添加历史对话
    if (dto.history && dto.history.length > 0) {
      messages.push(...dto.history.slice(-10)); // 最多保留10条历史
    }

    // 添加当前消息
    messages.push({ role: 'user', content: dto.message });

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        console.error('OpenAI API error:', response.status, await response.text());
        return { reply: '抱歉，AI助手暂时无法回复，请稍后再试。' };
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || '抱歉，我无法理解您的问题。';

      return { reply };
    } catch (error) {
      console.error('AI chat error:', error);
      return { reply: '抱歉，网络错误，请稍后再试。' };
    }
  }

  /**
   * 获取快捷问题列表
   */
  getQuickQuestions(language: string): { questions: string[] } {
    const questions: Record<string, string[]> = {
      'zh-CN': [
        '矿池怎么赚钱？',
        '秒合约怎么玩？',
        '如何邀请朋友？',
        '如何提现？',
      ],
      'en': [
        'How does mining pool work?',
        'How to trade second contracts?',
        'How to invite friends?',
        'How to withdraw?',
      ],
    };
    return { questions: questions[language] || questions['zh-CN'] };
  }
}
