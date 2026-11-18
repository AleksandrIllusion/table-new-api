import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./config/typeorm.config";
import { AuthModule } from "./modules/auth/auth.module";
import { CasinosModule } from "./modules/casinos/casinos.module";
import { CountriesModule } from "./modules/countries/countries.module";
import { CountryCodesModule } from "./modules/country-codes/country-codes.module";
import { BonusesModule } from "./modules/bonuses/bonuses.module";
import { FeaturesModule } from "./modules/features/features.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { SwitchModule } from "./modules/switch/switch.module";
import { UsersModule } from "./modules/users/users.module";
import { ThemeModule } from "./modules/theme/theme.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig()),
    AuthModule,
    CasinosModule,
    CountriesModule,
    CountryCodesModule,
    BonusesModule,
    FeaturesModule,
    PaymentsModule,
    SwitchModule,
    UsersModule,
    ThemeModule,
  ],
})
export class AppModule {}
