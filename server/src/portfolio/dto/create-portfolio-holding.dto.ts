import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, IsString, Matches, MaxLength } from 'class-validator';

export class CreatePortfolioHoldingDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  @Matches(/^[A-Z0-9.-]+$/)
  symbol!: string;

  @IsNumber()
  @IsPositive()
  shares!: number;

  @IsNumber()
  @IsPositive()
  averagePrice!: number;
}
