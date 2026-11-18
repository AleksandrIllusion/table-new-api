import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { CreateCasinoDto } from "./dto/create-casino.dto";
import { UpdateCasinoDto } from "./dto/update-casino.dto";

@Injectable()
export class CasinosService {
  constructor(@InjectDataSource() private readonly ds: DataSource) {}

  // Публичный листинг по коду страны: казино + агрегированные связи.
  // Все значения параметризованы, sort валидируется белым списком.
  async listByCountryCode(
    countryCode: string,
    opts: { limit: number; page: number; sort: "ASC" | "DESC" },
  ) {
    const offset = (opts.page - 1) * opts.limit;
    const rows = await this.ds.query(
      `
      SELECT
        c.id AS casino_id, c.title, c.link, c.logo_img, c.casino_rate,
        COALESCE(json_agg(DISTINCT jsonb_build_object('id', b.id, 'bonus', b.bonus))
          FILTER (WHERE b.id IS NOT NULL), '[]') AS bonuses,
        COALESCE(json_agg(DISTINCT jsonb_build_object('id', f.id, 'feature', f.feature))
          FILTER (WHERE f.id IS NOT NULL), '[]') AS features,
        COALESCE(json_agg(DISTINCT jsonb_build_object('id', p.id, 'payment', p.payment,
          'payment_link', p.payment_link)) FILTER (WHERE p.id IS NOT NULL), '[]') AS payments
      FROM cp_casinos c
      JOIN cp_casino_country_code rcc ON c.id = rcc.casino_id
      JOIN cp_country_codes cc ON rcc.country_code_id = cc.id AND cc.country_code = $1
      LEFT JOIN cp_casino_bonus rcb ON c.id = rcb.casino_id
      LEFT JOIN cp_bonuses b ON b.id = rcb.bonus_id
      LEFT JOIN cp_casino_feature rcf ON c.id = rcf.casino_id
      LEFT JOIN cp_features f ON f.id = rcf.feature_id
      LEFT JOIN cp_casino_payment rcp ON c.id = rcp.casino_id
      LEFT JOIN cp_payments p ON p.id = rcp.payment_id
      GROUP BY c.id
      ORDER BY c.casino_rate ${opts.sort}
      LIMIT $2 OFFSET $3
      `,
      [countryCode, opts.limit, offset],
    );
    return { data: rows };
  }

  async findOne(id: number) {
    const [row] = await this.ds.query(
      `
      SELECT
        c.id AS casino_id, c.title, c.link, c.logo_img, c.casino_rate,
        rc.country_id,
        rcc.country_code_id,
        COALESCE(json_agg(DISTINCT jsonb_build_object('id', b.id, 'bonus', b.bonus))
          FILTER (WHERE b.id IS NOT NULL), '[]') AS bonuses,
        COALESCE(json_agg(DISTINCT jsonb_build_object('id', f.id, 'feature', f.feature))
          FILTER (WHERE f.id IS NOT NULL), '[]') AS features,
        COALESCE(json_agg(DISTINCT jsonb_build_object('id', p.id, 'payment', p.payment,
          'payment_link', p.payment_link)) FILTER (WHERE p.id IS NOT NULL), '[]') AS payments
      FROM cp_casinos c
      LEFT JOIN cp_casino_country rc ON c.id = rc.casino_id
      LEFT JOIN cp_casino_country_code rcc ON c.id = rcc.casino_id
      LEFT JOIN cp_casino_bonus rcb ON c.id = rcb.casino_id
      LEFT JOIN cp_bonuses b ON b.id = rcb.bonus_id
      LEFT JOIN cp_casino_feature rcf ON c.id = rcf.casino_id
      LEFT JOIN cp_features f ON f.id = rcf.feature_id
      LEFT JOIN cp_casino_payment rcp ON c.id = rcp.casino_id
      LEFT JOIN cp_payments p ON p.id = rcp.payment_id
      WHERE c.id = $1
      GROUP BY c.id, rc.country_id, rcc.country_code_id
      `,
      [id],
    );
    if (!row) throw new NotFoundException(`Casino ${id} not found`);
    return row;
  }

  // Создание казино со всеми связями в одной транзакции.
  async create(dto: CreateCasinoDto) {
    return this.ds.transaction(async (m) => {
      const [casino] = await m.query(
        `INSERT INTO cp_casinos (title, link, logo_img, casino_rate)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [dto.title, dto.link, dto.logo_img, dto.casino_rate],
      );
      const id = casino.id;
      await m.query(
        `INSERT INTO cp_casino_country (casino_id, country_id) VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [id, dto.country_id],
      );
      await m.query(
        `INSERT INTO cp_casino_country_code (casino_id, country_code_id) VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [id, dto.country_code_id],
      );
      await this.replaceRelations(m, "cp_casino_bonus", "bonus_id", id, dto.bonuses);
      await this.replaceRelations(m, "cp_casino_feature", "feature_id", id, dto.features);
      await this.replaceRelations(m, "cp_casino_payment", "payment_id", id, dto.payments);
      return casino;
    });
  }

  async update(id: number, dto: UpdateCasinoDto) {
    return this.ds.transaction(async (m) => {
      const [exists] = await m.query(`SELECT id FROM cp_casinos WHERE id = $1`, [id]);
      if (!exists) throw new NotFoundException(`Casino ${id} not found`);

      const fields: string[] = [];
      const values: any[] = [];
      let i = 1;
      for (const key of ["title", "link", "logo_img", "casino_rate"] as const) {
        if (dto[key] !== undefined) {
          fields.push(`${key} = $${i++}`);
          values.push(dto[key]);
        }
      }
      if (fields.length) {
        values.push(id);
        await m.query(
          `UPDATE cp_casinos SET ${fields.join(", ")}, updated_at = now() WHERE id = $${i}`,
          values,
        );
      }
      if (dto.bonuses)
        await this.replaceRelations(m, "cp_casino_bonus", "bonus_id", id, dto.bonuses);
      if (dto.features)
        await this.replaceRelations(m, "cp_casino_feature", "feature_id", id, dto.features);
      if (dto.payments)
        await this.replaceRelations(m, "cp_casino_payment", "payment_id", id, dto.payments);

      return this.findOneWith(m, id);
    });
  }

  async remove(id: number) {
    const res = await this.ds.query(`DELETE FROM cp_casinos WHERE id = $1 RETURNING id`, [id]);
    if (res.length === 0) throw new NotFoundException(`Casino ${id} not found`);
    return { deleted: id };
  }


  // Полный список с пагинацией (для админки).
  async findAll(opts: { limit: number; page: number; sort: "ASC" | "DESC" }) {
    const offset = (opts.page - 1) * opts.limit;
    const data = await this.ds.query(
      `SELECT * FROM cp_casinos ORDER BY casino_rate ${opts.sort} LIMIT $1 OFFSET $2`,
      [opts.limit, offset],
    );
    const [{ count }] = await this.ds.query(`SELECT COUNT(*)::int AS count FROM cp_casinos`);
    return { data, total: count, page: opts.page, limit: opts.limit };
  }

  /**
   * Swap casino_rate with the neighbor in the country-code ranking
   * (ported from old BE switchCasinosRateController).
   * rateUp=true moves toward the top (higher rate); false moves down.
   */
  async switchRate(countryCodeId: number, casinoId: number, rateUp: boolean) {
    return this.ds.transaction(async (m) => {
      const casinos = await m.query(
        `SELECT c.id, c.casino_rate, c.title
         FROM cp_casinos c
         JOIN cp_casino_country_code rcc ON c.id = rcc.casino_id
         WHERE rcc.country_code_id = $1
         ORDER BY c.casino_rate DESC, c.id ASC`,
        [countryCodeId],
      );

      if (casinos.length === 0) {
        return {
          message:
            "There are no casinos for the specified country code in the database",
        };
      }

      const idx = casinos.findIndex(
        (c: { id: number | string }) => Number(c.id) === Number(casinoId),
      );
      if (idx === -1) {
        throw new NotFoundException("Casino not found for this country code");
      }

      if (rateUp && idx === 0) {
        return {
          message:
            "Rate of the target casino cannot be increased further, it is already the top",
        };
      }
      if (!rateUp && idx === casinos.length - 1) {
        return {
          message:
            "Rate of the target casino cannot be decreased further, it is already the lowest",
        };
      }

      const swapIdx = rateUp ? idx - 1 : idx + 1;
      const target = casinos[idx];
      const neighbor = casinos[swapIdx];

      await m.query(`UPDATE cp_casinos SET casino_rate = $1, updated_at = now() WHERE id = $2`, [
        neighbor.casino_rate,
        target.id,
      ]);
      await m.query(`UPDATE cp_casinos SET casino_rate = $1, updated_at = now() WHERE id = $2`, [
        target.casino_rate,
        neighbor.id,
      ]);

      return {
        message: "Rating updated successfully",
        updatedCasinos: [
          { id: target.id, newRate: neighbor.casino_rate },
          { id: neighbor.id, newRate: target.casino_rate },
        ],
      };
    });
  }

  // helpers
  private async replaceRelations(
    m: any,
    table: string,
    col: string,
    casinoId: number,
    ids: number[],
  ) {
    await m.query(`DELETE FROM ${table} WHERE casino_id = $1`, [casinoId]);
    if (!ids?.length) return;
    await m.query(
      `INSERT INTO ${table} (casino_id, ${col})
       SELECT $1, UNNEST($2::int[]) ON CONFLICT DO NOTHING`,
      [casinoId, ids],
    );
  }

  private async findOneWith(m: any, id: number) {
    const [row] = await m.query(`SELECT * FROM cp_casinos WHERE id = $1`, [id]);
    return row;
  }
}
