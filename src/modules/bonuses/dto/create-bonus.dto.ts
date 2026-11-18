import { IsString, MinLength } from "class-validator";
export class CreateBonusDto {
  @IsString() @MinLength(1) bonus!: string;
}
