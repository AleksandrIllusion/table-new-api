import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @UseGuards(JwtAuthGuard) @Get()
  findAll() { return this.service.findAll(); }

  @UseGuards(JwtAuthGuard) @Post("create")
  create(@Body() dto: CreateUserDto) { return this.service.create(dto); }
}
