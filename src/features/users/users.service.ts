import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./user.entity";
import { PasswordService } from "../../applications/password.service";
import { UsersCommandRepo } from "./repositories/users.commandRepo";
import { UsersQueryRepo } from "./repositories/users.queryRepo";
import { QueryInputUserDto } from "./dto/query-input-blog.dto";

@Injectable()
export class UsersService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly usersCommandRepo: UsersCommandRepo,
    private readonly usersQueryRepo: UsersQueryRepo,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.login = createUserDto.login;
    user.email = createUserDto.email;
    user.passwordHash = createUserDto.password;
    user.passwordSalt = await this.passwordService.generateSalt(10);
    user.createdAt = new Date();
    user.isConfirmed = false;

    return this.usersCommandRepo.create(user);
  }

  async findAll(sortData: QueryInputUserDto) {
    return await this.usersQueryRepo.find(sortData);
  }

  async remove(id: number) {
    return await this.usersCommandRepo.delete(id);
  }
}
