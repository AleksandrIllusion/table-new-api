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
exports.CountryCodesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const country_codes_service_1 = require("./country-codes.service");
const create_country_code_dto_1 = require("./dto/create-country-code.dto");
const update_country_code_dto_1 = require("./dto/update-country-code.dto");
const clone_storefront_dto_1 = require("./dto/clone-storefront.dto");
const copy_storefront_dto_1 = require("./dto/copy-storefront.dto");
let CountryCodesController = class CountryCodesController {
    constructor(service) {
        this.service = service;
    }
    findAll() { return this.service.findAll(); }
    byCountry(id) { return this.service.byCountryId(id); }
    create(dto) { return this.service.create(dto); }
    // Статический путь объявлен до :id, чтобы "clone" не трактовался как сегмент id.
    clone(dto) { return this.service.clone(dto); }
    // Статический путь до :id — copy-storefront не должен матчиться как id.
    copyStorefront(dto) { return this.service.copyStorefront(dto); }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) { return this.service.remove(id); }
};
exports.CountryCodesController = CountryCodesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CountryCodesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("country-id/:country_id"),
    __param(0, (0, common_1.Param)("country_id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CountryCodesController.prototype, "byCountry", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_country_code_dto_1.CreateCountryCodeDto]),
    __metadata("design:returntype", void 0)
], CountryCodesController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("clone"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [clone_storefront_dto_1.CloneStorefrontDto]),
    __metadata("design:returntype", void 0)
], CountryCodesController.prototype, "clone", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("copy-storefront"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [copy_storefront_dto_1.CopyStorefrontDto]),
    __metadata("design:returntype", void 0)
], CountryCodesController.prototype, "copyStorefront", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_country_code_dto_1.UpdateCountryCodeDto]),
    __metadata("design:returntype", void 0)
], CountryCodesController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CountryCodesController.prototype, "remove", null);
exports.CountryCodesController = CountryCodesController = __decorate([
    (0, common_1.Controller)("country-codes"),
    __metadata("design:paramtypes", [country_codes_service_1.CountryCodesService])
], CountryCodesController);
