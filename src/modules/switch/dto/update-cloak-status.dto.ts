import { IsBoolean, IsInt } from "class-validator";

export class UpdateCloakStatusDto {
  @IsInt()
  id!: number;

  @IsBoolean()
  cloaker!: boolean;
}
