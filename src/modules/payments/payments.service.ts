import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { CreatePaymentDto } from "./dto/create-payment.dto";
@Injectable()
export class PaymentsService {
  constructor(@InjectDataSource() private readonly ds: DataSource) {}
  findAll() { return this.ds.query(`SELECT * FROM cp_payments ORDER BY id ASC`); }
  async create(dto: CreatePaymentDto) {
    const [row] = await this.ds.query(
      `INSERT INTO cp_payments (payment, payment_link) VALUES ($1, $2) RETURNING *`,
      [dto.payment, dto.payment_link ?? null]);
    return row;
  }
}
