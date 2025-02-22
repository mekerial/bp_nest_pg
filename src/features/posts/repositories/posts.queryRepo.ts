import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "../entities/post.entity";
import { QueryInputPostDto } from "../dto/query-input-post.dto";

export class PostsQueryRepo {
  constructor(
    @InjectRepository(Post)
    protected readonly postsQueryRepo: Repository<Post>,
  ) {}
  async findAll(sortData: QueryInputPostDto) {
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = +(sortData.pageSize ?? 10);
    const sortBy = sortData.sortBy ?? "createdAt";
    const sortDirection = sortData.sortDirection ?? "DESC";

    const postsViewModel = await this.postsQueryRepo
      .createQueryBuilder("p")
      .orderBy(`p.${sortBy}`, sortDirection)
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .getMany();

    const pagesCount = Math.ceil(postsViewModel.length / pageSize);
    const totalCount = postsViewModel.length;

    return {
      page: +pageNumber,
      pageSize: +pageSize,
      pagesCount,
      totalCount,
      items: postsViewModel,
    };
  }
  async getAllPostsByBlog(blogId: number, sortData: QueryInputPostDto) {
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = +(sortData.pageSize ?? 10);
    const sortBy = sortData.sortBy ?? "createdAt";
    const sortDirection = sortData.sortDirection ?? "DESC";

    const postsViewModel = await this.postsQueryRepo
      .createQueryBuilder("p")
      .where("p.blogId = :blogId", { blogId })
      .orderBy(`p.${sortBy}`, sortDirection)
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .getMany();

    const pagesCount = Math.ceil(postsViewModel.length / pageSize);
    const totalCount = postsViewModel.length;

    return {
      page: +pageNumber,
      pageSize: +pageSize,
      pagesCount,
      totalCount,
      items: postsViewModel,
    };
  }
  async findOne(postId: number) {
    return await this.postsQueryRepo.find({ where: { id: postId } });
  }
}
