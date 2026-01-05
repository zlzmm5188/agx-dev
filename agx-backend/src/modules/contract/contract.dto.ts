import { IsNumber, IsPositive, IsIn } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  configId: number;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNumber()
  @IsIn([1, 2])
  direction: number; // 1看涨 2看跌
}
