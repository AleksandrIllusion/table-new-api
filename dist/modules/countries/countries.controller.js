"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountriesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const countries_service_1 = require("./countries.service");
const create_country_dto_1 = require("./dto/create-country.dto");
let CountriesController = class CountriesController {
    constructor(service) {
        this.service = service;
    }
    findAll() { return this.service.findAll(); }
    byCode(code) { return this.service.findByCountryCode(code); }
    create(dto) { return this.service.create(dto); }
};
exports.CountriesController = CountriesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CountriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("country/:country_code"),
    __param(0, (0, common_1.Param)("country_code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CountriesController.prototype, "byCode", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_country_dto_1.CreateCountryDto]),
    __metadata("design:returntype", void 0)
], CountriesController.prototype, "create", null);
exports.CountriesController = CountriesController = __decorate([
    (0, common_1.Controller)("countries"),
    __metadata("design:paramtypes", [countries_service_1.CountriesService])
], CountriesController);
