import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ThemeController } from "./theme.controller";
import { ThemeService } from "./theme.service";
@Module({ imports:[JwtModule.register({})], controllers:[ThemeController], providers:[ThemeService] })
export class ThemeModule {}
