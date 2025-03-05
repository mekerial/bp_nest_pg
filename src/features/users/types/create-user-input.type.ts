import { IsString, Length } from "class-validator";
import { Trim } from "../../../infrastructure/decorators/transform/trim";
import { IsOptionalEmail } from "../../../infrastructure/decorators/validators/is-email";

export class CreateUserInputType {
  @IsString()
  @Trim()
  @Length(3, 10, { message: "Length login is incorrect!" })
  login: string;

  @IsString()
  @Trim()
  @Length(6, 20, { message: "Length password is incorrect!" })
  password: string;

  @IsString()
  @IsOptionalEmail()
  email: string;
}
