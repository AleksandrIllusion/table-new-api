import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CountriesService } from "./countries.service";
import { CreateCountryDto } from "./dto/create-country.dto";

@Controller("countries")
export class CountriesController {
  constructor(private readonly service: CountriesService) {}

  @Get() findAll() { return this.service.findAll(); }

  @Get("country/:country_code")
  byCode(@Param("country_code") code: string) { return this.service.findByCountryCode(code); }

  @UseGuards(JwtAuthGuard)
  @Post("create")
  create(@Body() dto: CreateCountryDto) { return this.service.create(dto); }
}
