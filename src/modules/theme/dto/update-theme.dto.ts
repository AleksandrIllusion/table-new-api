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
  @IsOptional() @IsHexColor() button_fg?: string;
  @IsOptional() @IsHexColor() button_fg2?: string;
  @IsOptional() @IsIn(["classic","compact","split"]) card_variant?: string;
  @IsOptional() @IsInt() @Min(0) @Max(40) card_radius?: number;
  @IsOptional() @IsIn(["bar","corner"]) badge_style?: string;
  @IsOptional() @IsIn(["pill","square"]) pill_shape?: string;
  @IsOptional() @IsBoolean() show_logo?: boolean;
  @IsOptional() @IsBoolean() show_payments?: boolean;
  @IsOptional() @IsString() @MaxLength(40) font_heading?: string;
  @IsOptional() @IsString() @MaxLength(40) font_body?: string;
  @IsOptional() @IsInt() @Min(20) @Max(64) heading_size?: number;

  // --- card layout / positions ---
  @IsOptional() @IsIn(["tl","tr","bl","br"]) badge_position?: string;
  @IsOptional() @IsIn(["left","right"]) rating_position?: string;
  @IsOptional() @IsIn(["sm","md","lg"]) button_size?: string;
  @IsOptional() @IsIn(["left","center","right"]) button_align?: string;
  @IsOptional() @IsBoolean() button_full?: boolean;
  @IsOptional() @IsIn(["left","center","right"]) payments_align?: string;
  @IsOptional() @IsIn(["left","center"]) bonus_align?: string;

  // --- animation presets ---
  @IsOptional() @IsIn(["none","pulse","float","spin","glow"]) logo_anim?: string;
  @IsOptional() @IsIn(["none","pulse","glow","shine","bounce"]) button_anim?: string;

  // --- button icon ---
  @IsOptional() @IsString() @MaxLength(255) button_icon?: string;
  @IsOptional() @IsIn(["left","right"]) button_icon_pos?: string;
  @IsOptional() @IsInt() @Min(12) @Max(48) button_icon_size?: number;
  @IsOptional() @IsIn(["none","spin","pulse","bounce","glow"]) button_icon_anim?: string;

  // --- logo / rating / title ---
  @IsOptional() @IsInt() @Min(32) @Max(96) logo_size?: number;
  @IsOptional() @IsIn(["before","after"]) logo_order?: string;
  @IsOptional() @IsBoolean() show_title?: boolean;
  @IsOptional() @IsInt() @Min(18) @Max(48) rating_size?: number;
  @IsOptional() @IsBoolean() show_rating?: boolean;
}
