import { IsInt } from "class-validator";

export class UpdateCloakCountryDto {
  @IsInt()
  country_id!: number;

  @IsInt()
  cloaker_id!: number;
}
