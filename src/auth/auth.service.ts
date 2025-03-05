import { Injectable } from "@nestjs/common";
import { CreateUserInputModelType } from "./dto/user-types";
import { UsersService } from "../features/users/users.service";
import { add } from "date-fns/add";
import { v4 as uuidv4 } from "uuid";
import { emailAdapter } from "../applications/email/email.adapter";

@Injectable()
export class AuthService {
  constructor(protected usersService: UsersService) {}

  async registrateUser(inputModel: CreateUserInputModelType) {
    const confirmationCode = uuidv4();
    const codeExpirationDate = add(new Date(), {
      minutes: 15,
    });

    const user = {
      login: inputModel.login,
      password: inputModel.password,
      email: inputModel.email,
      confirmationCode: confirmationCode,
      codeExpirationDate: codeExpirationDate,
    };

    const userData = await this.usersService.create(user);

    if (!userData) {
      return null;
    }
    emailAdapter.sendConfirmToEmail(userData.email, confirmationCode);

    return true;
  }
}
