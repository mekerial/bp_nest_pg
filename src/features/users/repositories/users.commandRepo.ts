import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user.entity";
import { Repository } from "typeorm";

export class UsersCommandRepo {
  constructor(
    @InjectRepository(User)
    protected usersRepository: Repository<User>,
  ) {}
  async create(user: User) {
    const createdUser = await this.usersRepository.save(user);
    if (!createdUser) {
      return null;
    }
    return {
      id: user.id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
  async delete(id: number) {
    return await this.usersRepository.delete(id);
  }

  async updateConfirmationCode(
    id: number,
    confirmationCode: string,
    codeExpirationDate: Date,
  ) {
    return await this.usersRepository.update(id, {
      confirmationCode: confirmationCode,
      codeExpirationDate: codeExpirationDate,
    });
  }

  async confirmUser(id: number) {
    return await this.usersRepository.update(id, {
      isConfirmed: true,
    });
  }
}
