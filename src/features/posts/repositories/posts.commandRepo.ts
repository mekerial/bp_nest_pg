import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "../entities/post.entity";
import { CreatePostWithBlogIdWithDateDto } from "../dto/create-post.dto";

export class PostsCommandRepo {
  constructor(
    @InjectRepository(Post)
    protected readonly postsCommandRepo: Repository<Post>,
  ) {}
  async create(postData: CreatePostWithBlogIdWithDateDto) {
    return await this.postsCommandRepo.save(postData);
  }
}
