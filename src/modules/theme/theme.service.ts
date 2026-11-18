import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { UpdateThemeDto } from "./dto/update-theme.dto";

const COLS = [
  "header_title", "header_brand", "tagline", "pills", "badges", "logo_url",
  "accent_color", "bg_color", "card_from", "card_to",
  "button_text", "button_primary", "button_secondary",
  "card_variant", "card_radius", "badge_style", "pill_shape", "show_logo", "show_payments",
  "font_heading", "font_body", "heading_size",
];

@Injectable()
export class ThemeService {
  constructor(@InjectDataSource() private readonly ds: DataSource) {}

  async get() {
    const [row] = await this.ds.query(`SELECT * FROM cp_storefront_theme WHERE id = 1`);
    return row;
  }

  async update(dto: UpdateThemeDto) {
    const fields: string[] = [];
    const values: any[] = [];
    let i = 1;
    for (const key of COLS) {
      const v = (dto as any)[key];
      if (v === undefined) continue;
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
