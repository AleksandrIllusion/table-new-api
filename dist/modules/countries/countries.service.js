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
exports.CountriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let CountriesService = class CountriesService {
    constructor(ds) {
        this.ds = ds;
    }
    findAll() {
        return this.ds.query(`SELECT * FROM cp_countries ORDER BY country ASC`);
    }
    async findByCountryCode(code) {
        const [row] = await this.ds.query(`SELECT c.* FROM cp_countries c
       JOIN cp_country_codes cc ON cc.country_id = c.id
       WHERE cc.country_code = $1 LIMIT 1`, [code]);
        if (!row)
            throw new common_1.NotFoundException(`Country for code ${code} not found`);
        return row;
    }
    async create(dto) {
        const [dup] = await this.ds.query(`SELECT id FROM cp_countries WHERE country = $1`, [dto.country]);
        if (dup)
            throw new common_1.ConflictException(`Country ${dto.country} already exists`);
        const [row] = await this.ds.query(`INSERT INTO cp_countries (country) VALUES ($1) RETURNING *`, [dto.country]);
        return row;
    }
    async update(id, dto) {
        const [exists] = await this.ds.query(`SELECT id FROM cp_countries WHERE id = $1`, [id]);
        if (!exists)
            throw new common_1.NotFoundException(`Country ${id} not found`);
        const [dup] = await this.ds.query(`SELECT id FROM cp_countries WHERE country = $1 AND id <> $2`, [dto.country, id]);
        if (dup)
            throw new common_1.ConflictException(`Country ${dto.country} already exists`);
        const [row] = await this.ds.query(`UPDATE cp_countries SET country = $1 WHERE id = $2 RETURNING *`, [dto.country, id]);
        return row;
    }
    async remove(id) {
        const [hasCodes] = await this.ds.query(`SELECT 1 FROM cp_country_codes WHERE country_id = $1 LIMIT 1`, [id]);
        if (hasCodes) {
            throw new common_1.ConflictException("Country still has country codes — delete those first");
        }
        const res = await this.ds.query(`DELETE FROM cp_countries WHERE id = $1 RETURNING id`, [id]);
        if (!res.length)
            throw new common_1.NotFoundException(`Country ${id} not found`);
        return { deleted: id };
    }
};
exports.CountriesService = CountriesService;
exports.CountriesService = CountriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], CountriesService);
