import { IsOptional, IsString, Matches, MinLength } from "class-validator";
export class CreatePaymentDto {
  @IsString() @MinLength(1) payment!: string;
  @IsOptional() @IsString()
  @Matches(/^https:\/\/[^\s]+$/, { message: "payment_link must be a valid https:// URL" })
  payment_link?: string;
}
