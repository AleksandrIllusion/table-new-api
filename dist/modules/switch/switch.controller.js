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
exports.SwitchController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const check_cloak_status_dto_1 = require("./dto/check-cloak-status.dto");
const create_cloak_dto_1 = require("./dto/create-cloak.dto");
const create_geolocation_dto_1 = require("./dto/create-geolocation.dto");
const delete_cloaks_dto_1 = require("./dto/delete-cloaks.dto");
const update_cloak_country_dto_1 = require("./dto/update-cloak-country.dto");
const update_cloak_status_dto_1 = require("./dto/update-cloak-status.dto");
const switch_service_1 = require("./switch.service");
/**
 * Cloaker admin + public check endpoints.
 * Paths mirror old BE `/switch/*` for Backoffice compatibility.
 */
let SwitchController = class SwitchController {
    constructor(service) {
        this.service = service;
    }
    /** Public: visitor geo/domain check used by website integrations. */
    checkStatus(dto) {
        return this.service.checkStatus(dto);
    }
    getAllCloaks() {
        return this.service.findAllCloaks();
    }
    getCloakCountry(domain) {
        return this.service.getCloakCountry(domain);
    }
    switchStatus(dto) {
        return this.service.updateStatus(dto);
    }
    cloakerCountries() {
        return this.service.findAllCountries();
    }
    /** Seed/manage geolocation rows used by cloak country assignment. */
    createCountry(dto) {
        return this.service.createCountry(dto);
    }
    updateCloakCountry(dto) {
        return this.service.updateCountry(dto);
    }
    create(dto) {
        return this.service.create(dto);
    }
    remove(dto) {
        return this.service.remove(dto);
    }
    getAllLogs(country, createdAt, status) {
        return this.service.findAllLogs({
            country,
            created_at: createdAt,
            status,
        });
    }
    deleteLogs() {
        return this.service.deleteAllLogs();
    }
};
exports.SwitchController = SwitchController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_cloak_status_dto_1.CheckCloakStatusDto]),
    __metadata("design:returntype", void 0)
], SwitchController.prototype, "checkStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("get-all-cloaks"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SwitchController.prototype, "getAllCloaks", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("get-cloak-country/:domain"),
    __param(0, (0, common_1.Param)("domain")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SwitchController.prototype, "getCloakCountry", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)("switch-status"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_cloak_status_dto_1.UpdateCloakStatusDto]),
    __metadata("design:returntype", void 0)
], SwitchController.prototype, "switchStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("cloaker-countries"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SwitchController.prototype, "cloakerCountries", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("cloaker-countries/create"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_geolocation_dto_1.CreateGeolocationDto]),
    __metadata("design:returntype", void 0)
], SwitchController.prototype, "createCountry", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)("update-cloak-country"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_cloak_country_dto_1.UpdateCloakCountryDto]),
    __metadata("design:returntype", void 0)
], SwitchController.prototype, "updateCloakCountry", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cloak_dto_1.CreateCloakDto]),
    __metadata("design:returntype", void 0)
], SwitchController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)("delete"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_cloaks_dto_1.DeleteCloaksDto]),
    __metadata("design:returntype", void 0)
], SwitchController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("get-all-logs"),
    __param(0, (0, common_1.Query)("country")),
    __param(1, (0, common_1.Query)("created_at")),
    __param(2, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], SwitchController.prototype, "getAllLogs", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)("delete-logs"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SwitchController.prototype, "deleteLogs", null);
exports.SwitchController = SwitchController = __decorate([
    (0, common_1.Controller)("switch"),
    __metadata("design:paramtypes", [switch_service_1.SwitchService])
], SwitchController);
