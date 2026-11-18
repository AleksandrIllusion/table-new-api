import { ArrayNotEmpty, IsArray, IsInt } from "class-validator";

export class DeleteCloaksDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  cloak_list!: number[];
}
