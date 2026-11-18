import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CasinosService } from "./casinos.service";
import { CreateCasinoDto } from "./dto/create-casino.dto";
import { SwitchCasinoRateDto } from "./dto/switch-casino-rate.dto";
import { UpdateCasinoDto } from "./dto/update-casino.dto";

@Controller("casinos")
export class CasinosController {
  constructor(private readonly service: CasinosService) {}

  // --- public reads ---
  @Get()
  findAll(
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("sort", new DefaultValuePipe("DESC")) sortRaw: string,
  ) {
    const sort = sortRaw.toUpperCase() === "ASC" ? "ASC" : "DESC";
    return this.service.findAll({
      limit: Math.min(Math.max(limit, 1), 100),
      page: Math.max(page, 1),
      sort,
    });
  }

  @Get("website/country_code/:country_code")
  listByCountryCode(
    @Param("country_code") countryCode: string,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("sort", new DefaultValuePipe("DESC")) sortRaw: string,
  ) {
    const sort = sortRaw.toUpperCase() === "ASC" ? "ASC" : "DESC"; // белый список
    return this.service.listByCountryCode(countryCode, {
      limit: Math.min(Math.max(limit, 1), 100),
      page: Math.max(page, 1),
      sort,
    });
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // --- protected writes ---
  @UseGuards(JwtAuthGuard)
  @Post("create")
  create(@Body() dto: CreateCasinoDto) {
    return this.service.create(dto);
  }

  // Static path before :id so Nest does not treat "rating" as an id segment.
  @UseGuards(JwtAuthGuard)
  @Put("rating/:country_code_id")
  switchRate(
    @Param("country_code_id", ParseIntPipe) countryCodeId: number,
    @Body() dto: SwitchCasinoRateDto,
  ) {
    return this.service.switchRate(countryCodeId, dto.casino_id, dto.rate_update);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateCasinoDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
