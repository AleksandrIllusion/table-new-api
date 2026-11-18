import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { FeaturesController } from "./features.controller";
import { FeaturesService } from "./features.service";
@Module({ imports:[JwtModule.register({})], controllers:[FeaturesController], providers:[FeaturesService] })
export class FeaturesModule {}
