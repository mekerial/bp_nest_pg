import { Trim } from "../../infrastructure/decorators/transform/trim";
import { IsString, Length } from "class-validator";
import { IsOptionalEmail } from "../../infrastructure/decorators/validators/is-email";

export class CreateUserInputModelType {
  @Trim()
  @IsString()
  @Length(3, 10, { message: "login is incorrect!" })
  //@NameIsExist()
  login: string;

  @Trim()
  @IsString()
  @IsOptionalEmail()
  //@EmailIsExist()
  email: string;

  @IsString()
  @Length(6, 20, { message: "Length not correct" })
  password: string;
}

export type CreateUserWithoutValidation = {
  login: string;
  email: string;
  password: string;
};
