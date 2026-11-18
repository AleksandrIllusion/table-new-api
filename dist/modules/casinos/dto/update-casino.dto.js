"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCasinoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_casino_dto_1 = require("./create-casino.dto");
class UpdateCasinoDto extends (0, mapped_types_1.PartialType)(create_casino_dto_1.CreateCasinoDto) {
}
exports.UpdateCasinoDto = UpdateCasinoDto;
