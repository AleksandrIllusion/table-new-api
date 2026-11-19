import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { CreateCountryDto } from "./dto/create-country.dto";
import { UpdateCountryDto } from "./dto/update-country.dto";

@Injectable()
export class CountriesService {
  constructor(@InjectDataSource() private readonly ds: DataSource) {}

  findAll() {
    return this.ds.query(`SELECT * FROM cp_countries ORDER BY country ASC`);
  }

  async findByCountryCode(code: string) {
    const [row] = await this.ds.query(
      `SELECT c.* FROM cp_countries c
       JOIN cp_country_codes cc ON cc.country_id = c.id
       WHERE cc.country_code = $1 LIMIT 1`,
      [code],
    );
    if (!row) throw new NotFoundException(`Country for code ${code} not found`);
    return row;
  }

  async create(dto: CreateCountryDto) {
    const [dup] = await this.ds.query(
      `SELECT id FROM cp_countries WHERE country = $1`,
      [dto.country],
    );
    if (dup) throw new ConflictException(`Country ${dto.country} already exists`);
    const [row] = await this.ds.query(
      `INSERT INTO cp_countries (country) VALUES ($1) RETURNING *`,
      [dto.country],
    );
    return row;
  }

  async update(id: number, dto: UpdateCountryDto) {
    const [exists] = await this.ds.query(`SELECT id FROM cp_countries WHERE id = $1`, [id]);
    if (!exists) throw new NotFoundException(`Country ${id} not found`);
    const [dup] = await this.ds.query(
      `SELECT id FROM cp_countries WHERE country = $1 AND id <> $2`,
      [dto.country, id],
    );
    if (dup) throw new ConflictException(`Country ${dto.country} already exists`);
    const [row] = await this.ds.query(
      `UPDATE cp_countries SET country = $1 WHERE id = $2 RETURNING *`,
      [dto.country, id],
    );
    return row;
  }

  async remove(id: number) {
    const [hasCodes] = await this.ds.query(
      `SELECT 1 FROM cp_country_codes WHERE country_id = $1 LIMIT 1`,
      [id],
    );
    if (hasCodes) {
      throw new ConflictException("Country still has country codes — delete those first");
    }
    const res = await this.ds.query(
      `DELETE FROM cp_countries WHERE id = $1 RETURNING id`,
      [id],
    );
    if (!res.length) throw new NotFoundException(`Country ${id} not found`);
    return { deleted: id };
  }
}
