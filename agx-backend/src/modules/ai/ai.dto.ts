import { IsString, IsOptional, IsArray } from 'class-validator';

export class ChatDto {
  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsArray()
  @IsOptional()
  history?: Array<{ role: string; content: string }>;
}
