import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNumber,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
} from "class-validator";

// Только https-ссылки — отсекает javascript:, http и мусор на уровне входа.
const HTTPS = /^https:\/\/[^\s]+$/;

export class CreateCasinoDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsString()
  @Matches(HTTPS, { message: "link must be a valid https:// URL" })
  link!: string;

  @IsString()
  @Matches(HTTPS, { message: "logo_img must be a valid https:// URL" })
  logo_img!: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  casino_rate!: number;

  @IsInt()
  country_id!: number;

  @IsInt()
  country_code_id!: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  bonuses!: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  features!: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  payments!: number[];
}
