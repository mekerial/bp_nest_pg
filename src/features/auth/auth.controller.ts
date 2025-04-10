import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  ConfirmationCodeInputModel,
  CreateUserInputModelType,
  LoginInputModel,
  ResendEmailInputModel,
} from "./types/user-types";
import { Request, Response } from "express";
import { AuthGuard } from "../../infrastructure/guards/auth.guard";
import { JwtService } from "../../applications/jwt.service";
import { SecurityService } from "../security/security.service";
import { UsersService } from "../users/users.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly securityService: SecurityService,
  ) {}

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
    response.cookie("refreshToken", auth.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    response.cookie("deviceId", auth.deviceId, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return { accessToken: auth.accessToken };
  }

  @Get("me")
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async getProfile(@Req() request: Request) {
    console.log("/auth/me");

    const user = await this.userService.getUser(+request.userId);

    return {
      email: user.email,
      login: user.login,
      userId: user.id,
    };
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
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log("/auth/registration-email-resending");
    const resendEmail = await this.authService.registrationEmailResending(
      emailInputModel.email,
    );
    if (!resendEmail.flag) {
      response.status(400).send({
        errorsMessages: [
          {
            message: resendEmail.info,
            field: resendEmail.field,
          },
        ],
      });
    }
  }

  @Post("registration-confirmation")
  @HttpCode(204)
  async registrationConfirmation(
    @Body() codeInputModel: ConfirmationCodeInputModel,
  ) {
    console.log("/auth/registration-confirmation");
    const confirmation = await this.authService.registrationConfirmation(
      codeInputModel.code,
    );
    if (!confirmation) {
      throw new BadRequestException();
    }
    return;
  }

  @Post("refresh-token")
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async getRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log("/auth/refresh-token");

    const refreshToken = request.cookies.refreshToken;
    const deviceId = request.cookies.deviceId;
    const updateTokens = await this.jwtService.updateAccessTokenByRefreshToken(
      refreshToken,
      deviceId,
    );

    if (!updateTokens) {
      throw new UnauthorizedException();
    }
    const newAccessToken = updateTokens.accessToken;
    const newRefreshToken = updateTokens.refreshToken;
    response.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken: newAccessToken };
  }

  @Post("logout")
  @HttpCode(204)
  async logoutUser(@Req() request: Request) {
    console.log("/auth/logout");
    const refreshToken = request.cookies.refreshToken;

    const revokeRefreshToken =
      await this.jwtService.revokeRefreshToken(refreshToken);

    if (!revokeRefreshToken) {
      throw new UnauthorizedException();
    }
    const logout =
      await this.securityService.deleteSessionByRefreshToken(refreshToken);

    if (!logout) {
      throw new UnauthorizedException();
    }
    return;
  }
}
