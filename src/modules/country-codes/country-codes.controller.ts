import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CountryCodesService } from "./country-codes.service";
import { CreateCountryCodeDto } from "./dto/create-country-code.dto";

@Controller("country-codes")
export class CountryCodesController {
  constructor(private readonly service: CountryCodesService) {}

  @Get() findAll() { return this.service.findAll(); }

  @Get("country-id/:country_id")
  byCountry(@Param("country_id", ParseIntPipe) id: number) { return this.service.byCountryId(id); }

  @UseGuards(JwtAuthGuard)
  @Post("create")
  create(@Body() dto: CreateCountryCodeDto) { return this.service.create(dto); }
}
