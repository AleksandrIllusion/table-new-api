import { IsInt, IsOptional, IsString, Matches } from "class-validator";

/** Создать новый country_code и скопировать на него список казино исходной витрины. */
export class CloneStorefrontDto {
  @IsInt()
  source_country_code_id!: number;

  @IsString()
  @Matches(/^[A-Za-z0-9]{2,10}$/, { message: "country_code: 2-10 alphanumeric chars" })
  country_code!: string;

  // если не указан — берётся country_id исходного кода
  @IsOptional() @IsInt()
  country_id?: number;
}
