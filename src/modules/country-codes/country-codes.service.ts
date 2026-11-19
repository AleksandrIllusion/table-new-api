import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { CreateCountryCodeDto } from "./dto/create-country-code.dto";
import { UpdateCountryCodeDto } from "./dto/update-country-code.dto";
import { CloneStorefrontDto } from "./dto/clone-storefront.dto";

@Injectable()
export class CountryCodesService {
  constructor(@InjectDataSource() private readonly ds: DataSource) {}

  findAll() {
    return this.ds.query(`SELECT * FROM cp_country_codes ORDER BY country_code ASC`);
  }

  byCountryId(countryId: number) {
    return this.ds.query(
      `SELECT * FROM cp_country_codes WHERE country_id = $1 ORDER BY country_code ASC`,
      [countryId],
    );
  }

  async create(dto: CreateCountryCodeDto) {
    const [dup] = await this.ds.query(
      `SELECT id FROM cp_country_codes WHERE country_code = $1`,
      [dto.country_code],
    );
    if (dup) throw new ConflictException(`Country code ${dto.country_code} already exists`);
    const [row] = await this.ds.query(
      `INSERT INTO cp_country_codes (country_code, country_id) VALUES ($1, $2) RETURNING *`,
      [dto.country_code, dto.country_id],
    );
    return row;
  }

  async update(id: number, dto: UpdateCountryCodeDto) {
    const [current] = await this.ds.query(`SELECT * FROM cp_country_codes WHERE id = $1`, [id]);
    if (!current) throw new NotFoundException(`Country code ${id} not found`);

    if (dto.country_code && dto.country_code !== current.country_code) {
      const [dup] = await this.ds.query(
        `SELECT id FROM cp_country_codes WHERE country_code = $1 AND id <> $2`,
        [dto.country_code, id],
      );
      if (dup) throw new ConflictException(`Country code ${dto.country_code} already exists`);
    }

    const nextCode = dto.country_code ?? current.country_code;
    const nextCountryId = dto.country_id ?? current.country_id;
    const [row] = await this.ds.query(
      `UPDATE cp_country_codes SET country_code = $1, country_id = $2 WHERE id = $3 RETURNING *`,
      [nextCode, nextCountryId, id],
    );
    return row;
  }

  async remove(id: number) {
    return this.ds.transaction(async (m) => {
      const [exists] = await m.query(`SELECT id FROM cp_country_codes WHERE id = $1`, [id]);
      if (!exists) throw new NotFoundException(`Country code ${id} not found`);
      // снимаем привязки казино к этому коду (сами казино не трогаем)
      await m.query(`DELETE FROM cp_casino_country_code WHERE country_code_id = $1`, [id]);
      await m.query(`DELETE FROM cp_country_codes WHERE id = $1`, [id]);
      return { deleted: id };
    });
  }

  /**
   * Дублирование витрины: создаёт новый country_code и копирует на него
   * весь набор привязок казино (cp_casino_country_code) из исходного кода.
   * Рейтинг казино (casino_rate) общий в модели, поэтому новый рынок
   * стартует с тем же ранжированным списком.
   */
  async clone(dto: CloneStorefrontDto) {
    return this.ds.transaction(async (m) => {
      const [src] = await m.query(`SELECT * FROM cp_country_codes WHERE id = $1`, [dto.source_country_code_id]);
      if (!src) throw new NotFoundException(`Source country code ${dto.source_country_code_id} not found`);

      if (dto.country_code === src.country_code) {
        throw new BadRequestException("New country code must differ from the source");
      }
      const [dup] = await m.query(`SELECT id FROM cp_country_codes WHERE country_code = $1`, [dto.country_code]);
      if (dup) throw new ConflictException(`Country code ${dto.country_code} already exists`);

      const countryId = dto.country_id ?? src.country_id;
      const [created] = await m.query(
        `INSERT INTO cp_country_codes (country_code, country_id) VALUES ($1, $2) RETURNING *`,
        [dto.country_code, countryId],
      );
      const copied = await m.query(
        `INSERT INTO cp_casino_country_code (casino_id, country_code_id)
         SELECT casino_id, $1 FROM cp_casino_country_code WHERE country_code_id = $2
         RETURNING casino_id`,
        [created.id, src.id],
      );
      return { country_code: created, casinos_copied: copied.length };
    });
  }
}
