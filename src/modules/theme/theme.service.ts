import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { UpdateThemeDto } from "./dto/update-theme.dto";

const COLS = [
  "header_title", "header_brand", "tagline", "pills", "badges", "logo_url",
  "accent_color", "bg_color", "card_from", "card_to",
  "button_text", "button_primary", "button_secondary",
  "button_fg", "button_fg2",
  "card_variant", "card_radius", "badge_style", "pill_shape", "show_logo", "show_payments",
  "font_heading", "font_body", "heading_size",
  "badge_position", "rating_position", "button_size", "button_align", "button_full", "payments_align", "bonus_align",
  "logo_anim", "button_anim",
  "button_icon", "button_icon_pos", "button_icon_size", "button_icon_anim",
  "logo_size", "logo_order", "show_title", "rating_size", "show_rating",
  "rating_style",
  "header_padding", "header_margin_bottom",
  "rating_in_header", "rating_top", "rating_bottom",
];

@Injectable()
export class ThemeService {
  constructor(@InjectDataSource() private readonly ds: DataSource) {}

  private normalizeLogoUrl(value: unknown): string | null {
    if (value == null) return null;
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  async get() {
    const [row] = await this.ds.query(`SELECT * FROM cp_storefront_theme WHERE id = 1`);
    if (row && "logo_url" in row) {
      row.logo_url = this.normalizeLogoUrl(row.logo_url);
    }
    return row;
  }

  async update(dto: UpdateThemeDto) {
    const fields: string[] = [];
    const values: any[] = [];
    let i = 1;
    for (const key of COLS) {
      let v = (dto as any)[key];
      if (v === undefined) continue;
      if (key === "logo_url") v = this.normalizeLogoUrl(v);
      fields.push(`${key} = $${i++}`);
      values.push(key === "pills" || key === "badges" ? JSON.stringify(v) : v);
    }
    if (!fields.length) return this.get();
    values.push(1);
    await this.ds.query(
      `UPDATE cp_storefront_theme SET ${fields.join(", ")}, updated_at = now() WHERE id = $${i}`,
      values,
    );
    return this.get();
  }
}
