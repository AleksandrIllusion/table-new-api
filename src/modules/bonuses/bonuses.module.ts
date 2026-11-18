import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { BonusesController } from "./bonuses.controller";
import { BonusesService } from "./bonuses.service";
@Module({ imports:[JwtModule.register({})], controllers:[BonusesController], providers:[BonusesService] })
export class BonusesModule {}
