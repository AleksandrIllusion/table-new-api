import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CountriesService } from "./countries.service";
import { CreateCountryDto } from "./dto/create-country.dto";
import { UpdateCountryDto } from "./dto/update-country.dto";

@Controller("countries")
export class CountriesController {
  constructor(private readonly service: CountriesService) {}

  @Get() findAll() { return this.service.findAll(); }

  @Get("country/:country_code")
  byCode(@Param("country_code") code: string) { return this.service.findByCountryCode(code); }

  @UseGuards(JwtAuthGuard)
  @Post("create")
  create(@Body() dto: CreateCountryDto) { return this.service.create(dto); }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateCountryDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) { return this.service.remove(id); }
}
