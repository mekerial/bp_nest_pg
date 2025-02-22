import { InjectRepository } from "@nestjs/typeorm";
import { Blog } from "../entities/blog.entity";
import { Repository } from "typeorm";
import { UpdateBlogDto } from "../dto/update-blog.dto";

export class BlogsCommandRepo {
  constructor(
    @InjectRepository(Blog)
    protected readonly blogsCommandRepo: Repository<Blog>,
  ) {}
  async create(blogData: {
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date;
    isMembership: boolean;
  }) {
    return await this.blogsCommandRepo.save(blogData);
  }

  async update(id: number, updateBlogData: UpdateBlogDto) {
    return await this.blogsCommandRepo.update(id, updateBlogData);
  }

  async remove(id: number) {
    return await this.blogsCommandRepo.delete(id);
  }
}
