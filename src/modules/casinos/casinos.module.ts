import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { CasinosController } from "./casinos.controller";
import { CasinosService } from "./casinos.service";

@Module({
  imports: [JwtModule.register({})],
  controllers: [CasinosController],
  providers: [CasinosService],
})
export class CasinosModule {}
