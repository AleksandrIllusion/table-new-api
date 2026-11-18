import { ConflictException, Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(@InjectDataSource() private readonly ds: DataSource) {}

  // Пароли и хэши не отдаём.
  findAll() {
    return this.ds.query(
      `SELECT id, email, user_name, role, created_at FROM cp_users ORDER BY id ASC`,
    );
  }

  async create(dto: CreateUserDto) {
    const [dup] = await this.ds.query(
      `SELECT id FROM cp_users WHERE email = $1 OR user_name = $2`,
      [dto.email, dto.user_name],
    );
    if (dup) throw new ConflictException("Email or username already in use");

    const hash = await bcrypt.hash(dto.password, 10);
    const [row] = await this.ds.query(
      `INSERT INTO cp_users (email, password, user_name, role)
       VALUES ($1, $2, $3, false)
       RETURNING id, email, user_name, role, created_at`,
      [dto.email, hash, dto.user_name],
    );
    return row;
  }
}
