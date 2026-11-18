import { IsArray, IsBoolean, IsHexColor, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class UpdateThemeDto {
  @IsOptional() @IsString() @MaxLength(80) header_title?: string;
  @IsOptional() @IsString() @MaxLength(80) header_brand?: string;
  @IsOptional() @IsString() @MaxLength(160) tagline?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) pills?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) badges?: string[];
  @IsOptional() @IsString() logo_url?: string;
  @IsOptional() @IsHexColor() accent_color?: string;
  @IsOptional() @IsHexColor() bg_color?: string;
  @IsOptional() @IsHexColor() card_from?: string;
  @IsOptional() @IsHexColor() card_to?: string;
  @IsOptional() @IsString() @MaxLength(40) button_text?: string;
  @IsOptional() @IsHexColor() button_primary?: string;
  @IsOptional() @IsHexColor() button_secondary?: string;
  @IsOptional() @IsIn(["classic","compact","split"]) card_variant?: string;
  @IsOptional() @IsInt() @Min(0) @Max(40) card_radius?: number;
  @IsOptional() @IsIn(["bar","corner"]) badge_style?: string;
  @IsOptional() @IsIn(["pill","square"]) pill_shape?: string;
  @IsOptional() @IsBoolean() show_logo?: boolean;
  @IsOptional() @IsBoolean() show_payments?: boolean;
}
