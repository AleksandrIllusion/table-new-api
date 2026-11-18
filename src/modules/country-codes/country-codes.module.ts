import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { CountryCodesController } from "./country-codes.controller";
import { CountryCodesService } from "./country-codes.service";
@Module({
  imports: [JwtModule.register({})],
  controllers: [CountryCodesController],
  providers: [CountryCodesService],
})
export class CountryCodesModule {}
