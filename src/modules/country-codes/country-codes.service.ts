import { ConflictException, Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { CreateCountryCodeDto } from "./dto/create-country-code.dto";

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
}
