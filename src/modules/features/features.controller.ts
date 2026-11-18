import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { FeaturesService } from "./features.service";
import { CreateFeatureDto } from "./dto/create-feature.dto";
@Controller("features")
export class FeaturesController {
  constructor(private readonly service: FeaturesService) {}
  @Get() findAll() { return this.service.findAll(); }
  @UseGuards(JwtAuthGuard) @Post("create")
  create(@Body() dto: CreateFeatureDto) { return this.service.create(dto); }
}
