import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { SensitiveWord } from '../../entities';
import { CreateSensitiveWordDto, UpdateSensitiveWordDto } from './dto/sensitive-word.dto';

@Injectable()
export class SensitiveWordService {
  constructor(
    @InjectRepository(SensitiveWord)
    private sensitiveWordRepository: Repository<SensitiveWord>,
  ) {}

  /**
   * 检查文本是否包含敏感词
   */
  async checkSensitiveWords(text: string): Promise<{ hasSensitive: boolean; matchedWords: string[] }> {
    // 获取所有启用的敏感词
    const words = await this.sensitiveWordRepository.find({
      where: { status: 1 },
      order: { word: 'DESC' } // 按长度降序排列，优先匹配长词
    });

    const matchedWords = [];
    let hasSensitive = false;

    for (const word of words) {
      if (text.includes(word.word)) {
        hasSensitive = true;
        matchedWords.push(word.word);
      }
    }

    return { hasSensitive, matchedWords };
  }

  /**
   * 过滤文本中的敏感词（替换为*)
   */
  async filterSensitiveWords(text: string): Promise<string> {
    const words = await this.sensitiveWordRepository.find({
      where: { status: 1 },
      order: { word: 'DESC' } // 按长度降序排列，优先匹配长词
    });

    let filteredText = text;
    for (const word of words) {
      const regex = new RegExp(word.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      filteredText = filteredText.replace(regex, '*'.repeat(word.word.length));
    }

    return filteredText;
  }

  /**
   * 获取敏感词列表
   */
  async getSensitiveWords(options: FindManyOptions<SensitiveWord> = {}) {
    return await this.sensitiveWordRepository.find(options);
  }

  /**
   * 获取敏感词详情
   */
  async getSensitiveWord(id: number) {
    return await this.sensitiveWordRepository.findOne({ where: { id } });
  }

  /**
   * 创建敏感词
   */
  async createSensitiveWord(dto: CreateSensitiveWordDto) {
    const existing = await this.sensitiveWordRepository.findOne({
      where: { word: dto.word }
    });

    if (existing) {
      throw new Error('敏感词已存在');
    }

    const sensitiveWord = this.sensitiveWordRepository.create({
      word: dto.word,
      level: dto.level,
      status: dto.status ?? 1
    });

    return await this.sensitiveWordRepository.save(sensitiveWord);
  }

  /**
   * 更新敏感词
   */
  async updateSensitiveWord(id: number, dto: UpdateSensitiveWordDto) {
    const sensitiveWord = await this.sensitiveWordRepository.findOne({ where: { id } });
    if (!sensitiveWord) {
      throw new Error('敏感词不存在');
    }

    Object.assign(sensitiveWord, dto);
    return await this.sensitiveWordRepository.save(sensitiveWord);
  }

  /**
   * 删除敏感词
   */
  async deleteSensitiveWord(id: number) {
    const sensitiveWord = await this.sensitiveWordRepository.findOne({ where: { id } });
    if (!sensitiveWord) {
      throw new Error('敏感词不存在');
    }

    await this.sensitiveWordRepository.remove(sensitiveWord);
    return { success: true };
  }
}
