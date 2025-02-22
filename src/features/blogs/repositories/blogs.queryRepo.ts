import { InjectRepository } from "@nestjs/typeorm";
import { Blog } from "../entities/blog.entity";
import { Repository } from "typeorm";
import { QueryInputBlogDto } from "../dto/query-input-blog.dto";

export class BlogsQueryRepo {
  constructor(
    @InjectRepository(Blog)
    protected readonly blogsQueryRepo: Repository<Blog>,
  ) {}
  async findAll(sortData: QueryInputBlogDto) {
    const searchNameTerm = sortData.searchNameTerm ?? null;
    const sortBy = sortData.sortBy ?? "createdAt";
    const sortDirection = sortData.sortDirection ?? "DESC";
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = sortData.pageSize ?? 10;

    let blogsViewModel;

    if (searchNameTerm) {
      blogsViewModel = await this.blogsQueryRepo
        .createQueryBuilder("b")
        .where("b.name like :searchNameTerm", {
          searchNameTerm: `%${searchNameTerm}%`,
        })
        .orderBy(`b.${sortBy}`, sortDirection)
        .skip((pageNumber - 1) * pageSize)
        .take(pageSize)
        .getMany();
    } else {
      blogsViewModel = await this.blogsQueryRepo.find();
    }

    const pagesCount = Math.ceil(blogsViewModel.length / pageSize);
    const totalCount = blogsViewModel.length;

    return {
      page: +pageNumber,
      pageSize: +pageSize,
      pagesCount,
      totalCount,
      items: blogsViewModel,
    };
  }
  async findOne(id: number): Promise<Blog> {
    return this.blogsQueryRepo.findOneBy({ id });
  }
}
