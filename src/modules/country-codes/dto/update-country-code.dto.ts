import { IsInt, IsOptional, IsString, Matches } from "class-validator";
export class UpdateCountryCodeDto {
  @IsOptional() @IsString()
  @Matches(/^[A-Za-z0-9]{2,10}$/, { message: "country_code: 2-10 alphanumeric chars" })
  country_code?: string;

  @IsOptional() @IsInt()
  country_id?: number;
}
