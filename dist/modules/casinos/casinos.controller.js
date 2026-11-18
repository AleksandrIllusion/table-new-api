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
exports.CasinosController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const casinos_service_1 = require("./casinos.service");
const create_casino_dto_1 = require("./dto/create-casino.dto");
const switch_casino_rate_dto_1 = require("./dto/switch-casino-rate.dto");
const update_casino_dto_1 = require("./dto/update-casino.dto");
let CasinosController = class CasinosController {
    constructor(service) {
        this.service = service;
    }
    // --- public reads ---
    findAll(limit, page, sortRaw) {
        const sort = sortRaw.toUpperCase() === "ASC" ? "ASC" : "DESC";
        return this.service.findAll({
            limit: Math.min(Math.max(limit, 1), 100),
            page: Math.max(page, 1),
            sort,
        });
    }
    listByCountryCode(countryCode, limit, page, sortRaw) {
        const sort = sortRaw.toUpperCase() === "ASC" ? "ASC" : "DESC"; // белый список
        return this.service.listByCountryCode(countryCode, {
            limit: Math.min(Math.max(limit, 1), 100),
            page: Math.max(page, 1),
            sort,
        });
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    // --- protected writes ---
    create(dto) {
        return this.service.create(dto);
    }
    // Static path before :id so Nest does not treat "rating" as an id segment.
    switchRate(countryCodeId, dto) {
        return this.service.switchRate(countryCodeId, dto.casino_id, dto.rate_update);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.CasinosController = CasinosController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("limit", new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("page", new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)("sort", new common_1.DefaultValuePipe("DESC"))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], CasinosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("website/country_code/:country_code"),
    __param(0, (0, common_1.Param)("country_code")),
    __param(1, (0, common_1.Query)("limit", new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)("page", new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)("sort", new common_1.DefaultValuePipe("DESC"))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String]),
    __metadata("design:returntype", void 0)
], CasinosController.prototype, "listByCountryCode", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CasinosController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_casino_dto_1.CreateCasinoDto]),
    __metadata("design:returntype", void 0)
], CasinosController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)("rating/:country_code_id"),
    __param(0, (0, common_1.Param)("country_code_id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, switch_casino_rate_dto_1.SwitchCasinoRateDto]),
    __metadata("design:returntype", void 0)
], CasinosController.prototype, "switchRate", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_casino_dto_1.UpdateCasinoDto]),
    __metadata("design:returntype", void 0)
], CasinosController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CasinosController.prototype, "remove", null);
exports.CasinosController = CasinosController = __decorate([
    (0, common_1.Controller)("casinos"),
    __metadata("design:paramtypes", [casinos_service_1.CasinosService])
], CasinosController);
