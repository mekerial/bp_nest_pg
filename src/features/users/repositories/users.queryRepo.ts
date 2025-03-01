import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { QueryInputUserDto } from "../dto/query-input-blog.dto";

export class UsersQueryRepo {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async find(sortData: QueryInputUserDto) {
    const sortBy = sortData.sortBy ?? "createdAt";
    const sortDirection = sortData.sortDirection ?? "DESC";
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = sortData.pageSize ?? 10;
    const searchLoginTerm = sortData.searchLoginTerm ?? null;
    const searchEmailTerm = sortData.searchEmailTerm ?? null;

    let usersViewModel;

    if (searchLoginTerm) {
      usersViewModel = await this.usersRepository
        .createQueryBuilder("u")
        .where("u.login like :searchLoginTerm", {
          searchLoginTerm: `%${searchLoginTerm}%`,
        })
        .orderBy(`u.${sortBy}`, sortDirection)
        .skip((pageNumber - 1) * pageSize)
        .take(pageSize)
        .getMany();
    } else if (searchEmailTerm) {
      usersViewModel = await this.usersRepository
        .createQueryBuilder("u")
        .where("u.email like :searchEmailTerm", {
          searchEmailTerm: `%${searchEmailTerm}%`,
        })
        .orderBy(`u.${sortBy}`, sortDirection)
        .skip((pageNumber - 1) * pageSize)
        .take(pageSize)
        .getMany();
    } else {
      usersViewModel = await this.usersRepository.find();
    }

    const pagesCount = Math.ceil(usersViewModel.length / pageSize);
    const totalCount = usersViewModel.length;

    return {
      page: +pageNumber,
      pageSize: +pageSize,
      pagesCount,
      totalCount,
      items: usersViewModel,
    };
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
