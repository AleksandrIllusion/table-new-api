"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_config_1 = require("./config/typeorm.config");
const auth_module_1 = require("./modules/auth/auth.module");
const casinos_module_1 = require("./modules/casinos/casinos.module");
const countries_module_1 = require("./modules/countries/countries.module");
const country_codes_module_1 = require("./modules/country-codes/country-codes.module");
const bonuses_module_1 = require("./modules/bonuses/bonuses.module");
const features_module_1 = require("./modules/features/features.module");
const payments_module_1 = require("./modules/payments/payments.module");
const switch_module_1 = require("./modules/switch/switch.module");
const users_module_1 = require("./modules/users/users.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot((0, typeorm_config_1.typeOrmConfig)()),
            auth_module_1.AuthModule,
            casinos_module_1.CasinosModule,
            countries_module_1.CountriesModule,
            country_codes_module_1.CountryCodesModule,
            bonuses_module_1.BonusesModule,
            features_module_1.FeaturesModule,
            payments_module_1.PaymentsModule,
            switch_module_1.SwitchModule,
            users_module_1.UsersModule,
        ],
    })
], AppModule);
