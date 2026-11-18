import { IsEmail, IsString, Matches, MinLength } from "class-validator";
export class CreateUserDto {
  @IsEmail() email!: string;
  // min 6, хотя бы одна строчная, заглавная, цифра и спецсимвол
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/, {
    message: "password: min 6 chars, incl. lower, upper, digit and special",
  })
  password!: string;
  @IsString() @MinLength(3) user_name!: string;
}
