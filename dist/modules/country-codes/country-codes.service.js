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
exports.CountryCodesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let CountryCodesService = class CountryCodesService {
    constructor(ds) {
        this.ds = ds;
    }
    findAll() {
        return this.ds.query(`SELECT * FROM cp_country_codes ORDER BY country_code ASC`);
    }
    byCountryId(countryId) {
        return this.ds.query(`SELECT * FROM cp_country_codes WHERE country_id = $1 ORDER BY country_code ASC`, [countryId]);
    }
    async create(dto) {
        const [dup] = await this.ds.query(`SELECT id FROM cp_country_codes WHERE country_code = $1`, [dto.country_code]);
        if (dup)
            throw new common_1.ConflictException(`Country code ${dto.country_code} already exists`);
        const [row] = await this.ds.query(`INSERT INTO cp_country_codes (country_code, country_id) VALUES ($1, $2) RETURNING *`, [dto.country_code, dto.country_id]);
        return row;
    }
};
exports.CountryCodesService = CountryCodesService;
exports.CountryCodesService = CountryCodesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], CountryCodesService);
