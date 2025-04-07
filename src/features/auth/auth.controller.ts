import {
  Controller,
  Post,
  Body,
  HttpCode,
  Req,
  Res,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  CreateUserInputModelType,
  LoginInputModel,
  ResendEmailInputModel,
} from "./types/user-types";
import { Request, Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(200)
  async loginUser(
    @Body() inputModel: LoginInputModel,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log("/auth/login");
    const deviceTitle = request.headers["user-agent"] || "new device";
    const ip = request.ip || "no ip";

    const auth = await this.authService.loginUser(inputModel, deviceTitle, ip);
    if (!auth) {
      throw new UnauthorizedException();
    }
    // response.cookie("refreshToken", auth.refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "strict",
    // });
    response.cookie("deviceId", auth.deviceId, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return { accessToken: auth.accessToken };
  }

  @Post("registration")
  @HttpCode(204)
  async registrationUser(@Body() inputModel: CreateUserInputModelType) {
    console.log("/auth/registration");
    const regUser = await this.authService.registrateUser(inputModel);
    if (!regUser) {
      throw new Error();
    }
    return;
  }

  @Post("registration-email-resending")
  @HttpCode(204)
  async registrationEmailResending(
    @Body() emailInputModel: ResendEmailInputModel,
  ) {
    console.log("/auth/registration-email-resending");
    const resendEmail = await this.authService.registrationEmailResending(
      emailInputModel.email,
    );
    if (!resendEmail) {
      throw new BadRequestException();
    }
    return;
  }

  @Post("registration-confirmation")
  @HttpCode(204)
  async registrationConfirmation(@Body() confirmationCode: string) {
    console.log("/auth/registration-confirmation");
    const confirmation =
      await this.authService.registrationConfirmation(confirmationCode);
    if (!confirmation) {
      throw new BadRequestException();
    }
    return;
  }
}
