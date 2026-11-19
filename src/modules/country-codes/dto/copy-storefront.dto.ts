import { IsInt } from "class-validator";

/** Copy source country code's casino links onto an existing target (replacing prior links). */
export class CopyStorefrontDto {
  @IsInt()
  source_country_code_id!: number;

  @IsInt()
  target_country_code_id!: number;
}
