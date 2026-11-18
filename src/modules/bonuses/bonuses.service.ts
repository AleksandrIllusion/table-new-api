import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { CreateBonusDto } from "./dto/create-bonus.dto";
@Injectable()
export class BonusesService {
  constructor(@InjectDataSource() private readonly ds: DataSource) {}
  findAll() { return this.ds.query(`SELECT * FROM cp_bonuses ORDER BY id ASC`); }
  async create(dto: CreateBonusDto) {
    const [row] = await this.ds.query(
      `INSERT INTO cp_bonuses (bonus) VALUES ($1) RETURNING *`, [dto.bonus]);
    return row;
  }
}
