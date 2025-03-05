import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { PasswordService } from "../../applications/password.service";
import { UsersCommandRepo } from "./repositories/users.commandRepo";
import { UsersQueryRepo } from "./repositories/users.queryRepo";
import { CreateUserDbType } from "./types/create-user.DbType";

@Injectable()
export class UsersService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly usersCommandRepo: UsersCommandRepo,
    private readonly usersQueryRepo: UsersQueryRepo,
  ) {}

  async create(createUserDto: CreateUserDbType) {
    const user = new User();

    user.login = createUserDto.login;
    user.email = createUserDto.email;
    user.passwordHash = createUserDto.password;
    user.passwordSalt = await this.passwordService.generateSalt(10);
    user.createdAt = new Date();
    user.confirmationCode = createUserDto.confirmationCode || "no code";
    user.codeExpirationDate = createUserDto.codeExpirationDate || null;
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
}
