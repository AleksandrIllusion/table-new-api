import { Type } from "class-transformer";
import {
  IsObject,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from "class-validator";

class CheckCloakUserDto {
  @IsString()
  @MinLength(1)
  ip!: string;

  @IsString()
  @MinLength(1)
  country!: string;

  @IsString()
  @MinLength(1)
  domain!: string;

  @IsOptional()
  @IsString()
  hostname?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  org?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  /** Optional remote host used in the legacy client script URL. */
  @IsOptional()
  @IsString()
  remote?: string;
}

export class CheckCloakStatusDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CheckCloakUserDto)
  user!: CheckCloakUserDto;
}
