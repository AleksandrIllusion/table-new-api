import { IsBoolean, IsInt } from "class-validator";

export class SwitchCasinoRateDto {
  @IsInt()
  casino_id!: number;

  /** true = move up (higher rate), false = move down */
  @IsBoolean()
  rate_update!: boolean;
}
