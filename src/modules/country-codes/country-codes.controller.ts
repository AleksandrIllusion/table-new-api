import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CountryCodesService } from "./country-codes.service";
import { CreateCountryCodeDto } from "./dto/create-country-code.dto";
import { UpdateCountryCodeDto } from "./dto/update-country-code.dto";
import { CloneStorefrontDto } from "./dto/clone-storefront.dto";

@Controller("country-codes")
export class CountryCodesController {
  constructor(private readonly service: CountryCodesService) {}

  @Get() findAll() { return this.service.findAll(); }

  @Get("country-id/:country_id")
  byCountry(@Param("country_id", ParseIntPipe) id: number) { return this.service.byCountryId(id); }

  @UseGuards(JwtAuthGuard)
  @Post("create")
  create(@Body() dto: CreateCountryCodeDto) { return this.service.create(dto); }

  // Статический путь объявлен до :id, чтобы "clone" не трактовался как сегмент id.
  @UseGuards(JwtAuthGuard)
  @Post("clone")
  clone(@Body() dto: CloneStorefrontDto) { return this.service.clone(dto); }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateCountryCodeDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) { return this.service.remove(id); }
}
