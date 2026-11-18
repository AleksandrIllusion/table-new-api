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
exports.ThemeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const COLS = [
    "header_title", "header_brand", "tagline", "pills", "badges", "logo_url",
    "accent_color", "bg_color", "card_from", "card_to",
    "button_text", "button_primary", "button_secondary",
    "card_variant", "card_radius", "badge_style", "pill_shape", "show_logo", "show_payments",
];
let ThemeService = class ThemeService {
    constructor(ds) {
        this.ds = ds;
    }
    async get() {
        const [row] = await this.ds.query(`SELECT * FROM cp_storefront_theme WHERE id = 1`);
        return row;
    }
    async update(dto) {
        const fields = [];
        const values = [];
        let i = 1;
        for (const key of COLS) {
            const v = dto[key];
            if (v === undefined)
                continue;
            fields.push(`${key} = $${i++}`);
            values.push(key === "pills" || key === "badges" ? JSON.stringify(v) : v);
        }
        if (!fields.length)
            return this.get();
        values.push(1);
        await this.ds.query(`UPDATE cp_storefront_theme SET ${fields.join(", ")}, updated_at = now() WHERE id = $${i}`, values);
        return this.get();
    }
};
exports.ThemeService = ThemeService;
exports.ThemeService = ThemeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], ThemeService);
