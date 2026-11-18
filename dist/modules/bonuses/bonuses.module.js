"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BonusesModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bonuses_controller_1 = require("./bonuses.controller");
const bonuses_service_1 = require("./bonuses.service");
let BonusesModule = class BonusesModule {
};
exports.BonusesModule = BonusesModule;
exports.BonusesModule = BonusesModule = __decorate([
    (0, common_1.Module)({ imports: [jwt_1.JwtModule.register({})], controllers: [bonuses_controller_1.BonusesController], providers: [bonuses_service_1.BonusesService] })
], BonusesModule);
