import { IsString, MinLength } from "class-validator";
export class CreateFeatureDto { @IsString() @MinLength(1) feature!: string; }
