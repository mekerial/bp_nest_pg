import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user.entity";
import { Repository } from "typeorm";

export class UsersCommandRepo {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async create(user: User) {
    return await this.usersRepository.save(user);
  }
  async delete(id: number) {
    return await this.usersRepository.delete(id);
  }
}
