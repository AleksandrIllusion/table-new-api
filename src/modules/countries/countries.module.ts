import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { CountriesController } from "./countries.controller";
import { CountriesService } from "./countries.service";
@Module({
  imports: [JwtModule.register({})],
  controllers: [CountriesController],
  providers: [CountriesService],
})
export class CountriesModule {}
