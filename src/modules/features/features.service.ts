import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { CreateFeatureDto } from "./dto/create-feature.dto";
@Injectable()
export class FeaturesService {
  constructor(@InjectDataSource() private readonly ds: DataSource) {}
  findAll() { return this.ds.query(`SELECT * FROM cp_features ORDER BY id ASC`); }
  async create(dto: CreateFeatureDto) {
    const [row] = await this.ds.query(
      `INSERT INTO cp_features (feature) VALUES ($1) RETURNING *`, [dto.feature]);
    return row;
  }
}
