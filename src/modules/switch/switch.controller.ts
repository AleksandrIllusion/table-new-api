import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CheckCloakStatusDto } from "./dto/check-cloak-status.dto";
import { CreateCloakDto } from "./dto/create-cloak.dto";
import { CreateGeolocationDto } from "./dto/create-geolocation.dto";
import { DeleteCloaksDto } from "./dto/delete-cloaks.dto";
import { UpdateCloakCountryDto } from "./dto/update-cloak-country.dto";
import { UpdateCloakStatusDto } from "./dto/update-cloak-status.dto";
import { SwitchService } from "./switch.service";

/**
 * Cloaker admin + public check endpoints.
 * Paths mirror old BE `/switch/*` for Backoffice compatibility.
 */
@Controller("switch")
export class SwitchController {
  constructor(private readonly service: SwitchService) {}

  /** Public: visitor geo/domain check used by website integrations. */
  @Post()
  @HttpCode(200)
  checkStatus(@Body() dto: CheckCloakStatusDto) {
    return this.service.checkStatus(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("get-all-cloaks")
  getAllCloaks() {
    return this.service.findAllCloaks();
  }

  @UseGuards(JwtAuthGuard)
  @Get("get-cloak-country/:domain")
  getCloakCountry(@Param("domain") domain: string) {
    return this.service.getCloakCountry(domain);
  }

  @UseGuards(JwtAuthGuard)
  @Put("switch-status")
  switchStatus(@Body() dto: UpdateCloakStatusDto) {
    return this.service.updateStatus(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("cloaker-countries")
  cloakerCountries() {
    return this.service.findAllCountries();
  }

  /** Seed/manage geolocation rows used by cloak country assignment. */
  @UseGuards(JwtAuthGuard)
  @Post("cloaker-countries/create")
  createCountry(@Body() dto: CreateGeolocationDto) {
    return this.service.createCountry(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put("update-cloak-country")
  updateCloakCountry(@Body() dto: UpdateCloakCountryDto) {
    return this.service.updateCountry(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("create")
  create(@Body() dto: CreateCloakDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("delete")
  remove(@Body() dto: DeleteCloaksDto) {
    return this.service.remove(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("get-all-logs")
  getAllLogs(
    @Query("country") country?: string,
    @Query("created_at") createdAt?: string,
    @Query("status") status?: string,
  ) {
    return this.service.findAllLogs({
      country,
      created_at: createdAt,
      status,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete("delete-logs")
  deleteLogs() {
    return this.service.deleteAllLogs();
  }
}
