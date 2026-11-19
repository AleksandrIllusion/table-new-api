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
    async update(id, dto) {
        const [current] = await this.ds.query(`SELECT * FROM cp_country_codes WHERE id = $1`, [id]);
        if (!current)
            throw new common_1.NotFoundException(`Country code ${id} not found`);
        if (dto.country_code && dto.country_code !== current.country_code) {
            const [dup] = await this.ds.query(`SELECT id FROM cp_country_codes WHERE country_code = $1 AND id <> $2`, [dto.country_code, id]);
            if (dup)
                throw new common_1.ConflictException(`Country code ${dto.country_code} already exists`);
        }
        const nextCode = dto.country_code ?? current.country_code;
        const nextCountryId = dto.country_id ?? current.country_id;
        const [row] = await this.ds.query(`UPDATE cp_country_codes SET country_code = $1, country_id = $2 WHERE id = $3 RETURNING *`, [nextCode, nextCountryId, id]);
        return row;
    }
    async remove(id) {
        return this.ds.transaction(async (m) => {
            const [exists] = await m.query(`SELECT id FROM cp_country_codes WHERE id = $1`, [id]);
            if (!exists)
                throw new common_1.NotFoundException(`Country code ${id} not found`);
            // снимаем привязки казино к этому коду (сами казино не трогаем)
            await m.query(`DELETE FROM cp_casino_country_code WHERE country_code_id = $1`, [id]);
            await m.query(`DELETE FROM cp_country_codes WHERE id = $1`, [id]);
            return { deleted: id };
        });
    }
    /**
     * Дублирование витрины: создаёт новый country_code и копирует на него
     * весь набор привязок казино (cp_casino_country_code) из исходного кода.
     * Рейтинг казино (casino_rate) общий в модели, поэтому новый рынок
     * стартует с тем же ранжированным списком.
     */
    async clone(dto) {
        return this.ds.transaction(async (m) => {
            const [src] = await m.query(`SELECT * FROM cp_country_codes WHERE id = $1`, [dto.source_country_code_id]);
            if (!src)
                throw new common_1.NotFoundException(`Source country code ${dto.source_country_code_id} not found`);
            if (dto.country_code === src.country_code) {
                throw new common_1.BadRequestException("New country code must differ from the source");
            }
            const [dup] = await m.query(`SELECT id FROM cp_country_codes WHERE country_code = $1`, [dto.country_code]);
            if (dup)
                throw new common_1.ConflictException(`Country code ${dto.country_code} already exists`);
            const countryId = dto.country_id ?? src.country_id;
            const [created] = await m.query(`INSERT INTO cp_country_codes (country_code, country_id) VALUES ($1, $2) RETURNING *`, [dto.country_code, countryId]);
            const copied = await m.query(`INSERT INTO cp_casino_country_code (casino_id, country_code_id)
         SELECT casino_id, $1 FROM cp_casino_country_code WHERE country_code_id = $2
         RETURNING casino_id`, [created.id, src.id]);
            return { country_code: created, casinos_copied: copied.length };
        });
    }
    /**
     * Copy storefront onto an existing country code: replace target's
     * cp_casino_country_code rows with the source code's casino set.
     * Ratings (casino_rate) are global, so the ranked list matches the source.
     */
    async copyStorefront(dto) {
        return this.ds.transaction(async (m) => {
            if (dto.source_country_code_id === dto.target_country_code_id) {
                throw new common_1.BadRequestException("Source and target country codes must differ");
            }
            const [src] = await m.query(`SELECT * FROM cp_country_codes WHERE id = $1`, [dto.source_country_code_id]);
            if (!src) {
                throw new common_1.NotFoundException(`Source country code ${dto.source_country_code_id} not found`);
            }
            const [target] = await m.query(`SELECT * FROM cp_country_codes WHERE id = $1`, [dto.target_country_code_id]);
            if (!target) {
                throw new common_1.NotFoundException(`Target country code ${dto.target_country_code_id} not found`);
            }
            await m.query(`DELETE FROM cp_casino_country_code WHERE country_code_id = $1`, [target.id]);
            const copied = await m.query(`INSERT INTO cp_casino_country_code (casino_id, country_code_id)
         SELECT casino_id, $1 FROM cp_casino_country_code WHERE country_code_id = $2
         RETURNING casino_id`, [target.id, src.id]);
            return { target, casinos_copied: copied.length };
        });
    }
};
exports.CountryCodesService = CountryCodesService;
exports.CountryCodesService = CountryCodesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], CountryCodesService);
