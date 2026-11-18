import { IsString, MinLength } from "class-validator";

export class CreateGeolocationDto {
  @IsString()
  @MinLength(1)
  country!: string;
}
