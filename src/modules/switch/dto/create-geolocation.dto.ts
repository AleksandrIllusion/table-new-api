import { IsString, Matches } from "class-validator";

/** ISO country code stored in `cp_geolocation.country` (e.g. CY, GB, UK). */
export class CreateGeolocationDto {
  @IsString()
  @Matches(/^[A-Za-z]{2,10}$/, { message: "country must be a 2–10 letter ISO code" })
  country!: string;
}
