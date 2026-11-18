import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { BonusesService } from "./bonuses.service";
import { CreateBonusDto } from "./dto/create-bonus.dto";
@Controller("bonuses")
export class BonusesController {
  constructor(private readonly service: BonusesService) {}
  @Get() findAll() { return this.service.findAll(); }
  @UseGuards(JwtAuthGuard) @Post("create")
  create(@Body() dto: CreateBonusDto) { return this.service.create(dto); }
}
