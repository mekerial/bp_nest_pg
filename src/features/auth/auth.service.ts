import { Injectable } from "@nestjs/common";
import { CreateUserInputModelType, LoginInputModel } from "./types/user-types";
import { UsersService } from "../users/users.service";
import { add } from "date-fns/add";
import { v4 as uuidv4 } from "uuid";
import { emailAdapter } from "../../applications/email/email.adapter";
import { JwtService } from "../../applications/jwt.service";
import { UsersQueryRepo } from "../users/repositories/users.queryRepo";
import { SecurityService } from "../security/security.service";

@Injectable()
export class AuthService {
  constructor(
    protected usersService: UsersService,
    protected jwtService: JwtService,
    protected usersQueryRepo: UsersQueryRepo,
    protected securityService: SecurityService,
  ) {}

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

  async loginUser(
    inputModel: LoginInputModel,
    deviceTitle: string,
    ip: string,
  ) {
    const auth = await this.usersService.checkCredentials(inputModel);
    if (!auth) {
      return false;
    }

    const accessToken = this.jwtService.createAccessJWT(auth.id);
    const deviceId = uuidv4();
    const refreshToken = await this.jwtService.createRefreshJWT(
      auth.id,
      deviceId,
    );
    const userId = auth.id;

    await this.securityService.createSession(
      ip,
      deviceTitle,
      deviceId,
      userId,
      refreshToken,
    );

    return {
      refreshToken: refreshToken,
      deviceId: deviceId,
      accessToken: accessToken,
    };
  }

  async registrationEmailResending(email: string) {
    const user = await this.usersQueryRepo.findOneByLoginOrEmail(email);
    if (!user) {
      return {
        false: false,
        info: "User not found",
        field: "email",
      };
    }
    if (user.isConfirmed) {
      return {
        flag: false,
        info: "Email already confirmed",
        field: "email",
      };
    }
    const confirmationCode = uuidv4();
    const codeExpirationDate = add(new Date(), {
      minutes: 15,
    });
    await this.usersService.updateConfirmationCode(
      user.id,
      confirmationCode,
      codeExpirationDate,
    );
    emailAdapter.sendConfirmToEmail(email, confirmationCode);
    return {
      flag: true,
      info: "Check your email",
      field: "email",
    };
  }

  async registrationConfirmation(confirmationCode: string) {
    const user =
      await this.usersQueryRepo.findOneByConfirmationCode(confirmationCode);
    if (!user) {
      return false;
    }
    if (user.isConfirmed) {
      return false;
    }
    await this.usersService.confirmUser(user.id);
    return true;
  }
}
