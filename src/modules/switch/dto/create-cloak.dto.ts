import { IsBoolean, IsInt, IsString, Matches, MinLength } from "class-validator";

// Hostname-like domain: example.com or sub.example.co.uk
const DOMAIN = /^(?=.{1,253}$)(?!-)[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;

export class CreateCloakDto {
  @IsString()
  @MinLength(3)
  @Matches(DOMAIN, { message: "domain must look like example.com" })
  domain!: string;

  @IsInt()
  country_id!: number;

  @IsBoolean()
  cloaker!: boolean;
}
