import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { SwitchController } from "./switch.controller";
import { SwitchService } from "./switch.service";

@Module({
  imports: [JwtModule.register({})],
  controllers: [SwitchController],
  providers: [SwitchService],
})
export class SwitchModule {}
