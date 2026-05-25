import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateWatchlistDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name!: string;
}
