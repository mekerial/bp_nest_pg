import { Controller, Post, Body, HttpCode } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserInputModelType } from "./dto/user-types";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("registration")
  @HttpCode(204)
  async registrationUser(@Body() inputModel: CreateUserInputModelType) {
    const regUser = await this.authService.registrateUser(inputModel);
    if (!regUser) {
      throw new Error();
    }
    return;
  }
}
