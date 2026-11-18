import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { ThemeService } from "./theme.service";
import { UpdateThemeDto } from "./dto/update-theme.dto";

@Controller("theme")
export class ThemeController {
  constructor(private readonly service: ThemeService) {}

  @Get() get() { return this.service.get(); }

  @UseGuards(JwtAuthGuard) @Put()
  update(@Body() dto: UpdateThemeDto) { return this.service.update(dto); }
}
