import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { CreateCountryDto } from "./dto/create-country.dto";

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
}
