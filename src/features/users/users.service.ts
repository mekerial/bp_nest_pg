import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { PasswordService } from "../../applications/password.service";
import { UsersCommandRepo } from "./repositories/users.commandRepo";
import { UsersQueryRepo } from "./repositories/users.queryRepo";
import { CreateUserDbType } from "./types/create-user.DbType";
import { LoginInputModel } from "../auth/types/user-types";

@Injectable()
export class UsersService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly usersCommandRepo: UsersCommandRepo,
    private readonly usersQueryRepo: UsersQueryRepo,
  ) {}

  async create(createUserDto: CreateUserDbType) {
    const user = new User();

    const generatedSalt = await this.passwordService.generateSalt(10);
    const passwordHash = await this.passwordService.generateHash(
      createUserDto.password,
      generatedSalt,
    );
    user.passwordHash = passwordHash;

    user.login = createUserDto.login;
    user.email = createUserDto.email;
    user.passwordHash = passwordHash;
    user.passwordSalt = generatedSalt;
    user.createdAt = new Date();
    user.confirmationCode = createUserDto.confirmationCode || "no code";
    user.codeExpirationDate = createUserDto.codeExpirationDate || new Date();
    user.isConfirmed = false;

    return await this.usersCommandRepo.create(user);
  }

  async remove(id: number) {
    const findUser = await this.usersQueryRepo.findOne(id);
    if (!findUser) {
      return;
    }
    return await this.usersCommandRepo.delete(id);
  }

  async checkCredentials(loginData: LoginInputModel) {
    const user = await this.usersQueryRepo.findOneByLoginOrEmail(
      loginData.loginOrEmail,
    );
    if (!user) {
      return null;
    }
    const passwordHash = await this.passwordService.generateHash(
      loginData.password,
      user.passwordSalt,
    );
    console.log(user.passwordHash, passwordHash);
    if (user.passwordHash !== passwordHash) {
      return null;
    }
    return user;
  }

  async updateConfirmationCode(
    id: number,
    confirmationCode: string,
    codeExpirationDate: Date,
  ) {
    return await this.usersCommandRepo.updateConfirmationCode(
      id,
      confirmationCode,
      codeExpirationDate,
    );
  }

  async confirmUser(id: number) {
    return await this.usersCommandRepo.confirmUser(id);
  }

  async getUser(userId: number) {
    return await this.usersQueryRepo.findOne(userId);
  }
}
