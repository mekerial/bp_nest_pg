import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { QueryInputUserType } from "../types/query-input-user.type";
import { SortByFields } from "../../../common/query-types";

export class UsersQueryRepo {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async find(sortData: QueryInputUserType) {
    const sortBy: SortByFields = Object.values(SortByFields).includes(
      sortData.sortBy as SortByFields,
    )
      ? (sortData.sortBy as SortByFields)
      : SortByFields.CREATED_AT;

    const sortDirection =
      typeof sortData.sortDirection === "string" &&
      ["ASC", "DESC"].includes(sortData.sortDirection.toUpperCase())
        ? (sortData.sortDirection.toUpperCase() as "ASC" | "DESC")
        : "DESC"; // Меняем ASC на DESC

    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = sortData.pageSize ?? 10;
    const searchLoginTerm = sortData.searchLoginTerm?.trim() || null;
    const searchEmailTerm = sortData.searchEmailTerm?.trim() || null;

    const query = this.usersRepository.createQueryBuilder("u");

    if (searchLoginTerm || searchEmailTerm) {
      query.where(
        "(LOWER(u.login) LIKE LOWER(:searchLoginTerm) OR LOWER(u.email) LIKE LOWER(:searchEmailTerm))",
        {
          searchLoginTerm: searchLoginTerm ? `%${searchLoginTerm}%` : "%%",
          searchEmailTerm: searchEmailTerm ? `%${searchEmailTerm}%` : "%%",
        },
      );
    }

    const sortField =
      sortBy === SortByFields.CREATED_AT
        ? `u.${sortBy}`
        : `u.${sortBy} COLLATE "C"`; // Указание COLLATE для предсказуемой сортировки

    const [usersViewModel, totalCount] = await query
      .orderBy(sortField, sortDirection)
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      page: +pageNumber,
      pageSize: +pageSize,
      pagesCount: Math.ceil(totalCount / pageSize),
      totalCount: totalCount ?? 0,
      items: usersViewModel.map((u) => ({
        id: u.id.toString(),
        login: u.login,
        email: u.email,
        createdAt: u.createdAt,
      })),
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

  async findOneByLoginOrEmail(loginOrEmail: string) {
    const user = await this.usersRepository
      .createQueryBuilder("user")
      .where("user.login = :loginOrEmail OR user.email = :loginOrEmail", {
        loginOrEmail,
      })
      .getOne();

    return user || null;
  }

  async emailIsExist(email: string) {
    const user = await this.usersRepository.findOneBy({ email: email });
    if (!user) {
      return false;
    }
    return true;
  }

  async nameIsExist(login: string) {
    const user = await this.usersRepository.findOneBy({ login: login });
    if (!user) {
      return false;
    }
    return true;
  }
}
