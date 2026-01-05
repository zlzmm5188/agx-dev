import { IsNumber, IsPositive, Min } from 'class-validator';

export class SubscribePoolDto {
  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsPositive()
  @Min(0.00000001)
  amount: number;
}

export class RedeemPoolDto {
  @IsNumber()
  @IsPositive()
  holdingId: number;
}
