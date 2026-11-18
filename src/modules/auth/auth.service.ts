import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectDataSource() private readonly ds: DataSource,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const [user] = await this.ds.query(
      `SELECT id, email, password FROM cp_users WHERE email = $1`,
      [dto.email],
    );
    // Одинаковый ответ на "нет пользователя" и "неверный пароль" — не раскрываем,
    // существует ли email.
    const ok = user && (await bcrypt.compare(dto.password, user.password));
    if (!ok) throw new UnauthorizedException("Invalid email or password");

    const token = await this.jwt.signAsync(
      { sub: user.id, email: user.email },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || "2h",
      },
    );
    return { token };
  }
}
