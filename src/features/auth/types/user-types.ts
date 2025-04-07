import { Trim } from "../../../infrastructure/decorators/transform/trim";
import { IsString, Length } from "class-validator";
import { IsOptionalEmail } from "../../../infrastructure/decorators/validators/isOptionalEmail";
import { EmailIsExist } from "../../../infrastructure/decorators/validators/email-is-exist.decorator";
import { NameIsExist } from "../../../infrastructure/decorators/validators/name-is-exist.decorator";

export class CreateUserInputModelType {
  @Trim()
  @IsString()
  @Length(3, 10, { message: "login is incorrect!" })
  @NameIsExist()
  login: string;

  @Trim()
  @IsString()
  @IsOptionalEmail()
  @EmailIsExist()
  email: string;

  @IsString()
  @Length(6, 20, { message: "Length not correct" })
  password: string;
}

export class ResendEmailInputModel {
  @IsString()
  @Trim()
  // @EmailIsExist()
  email: string;
}

export type CreateUserWithoutValidation = {
  login: string;
  email: string;
  password: string;
};

export type LoginInputModel = {
  loginOrEmail: string;
  password: string;
};

export type ConfirmationCodeInputModel = {
  code: string;
};
