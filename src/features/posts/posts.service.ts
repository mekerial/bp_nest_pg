import { Injectable } from "@nestjs/common";
import { CreatePostWithBlogIdDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { BlogsQueryRepo } from "../blogs/repositories/blogs.queryRepo";
import { PostsCommandRepo } from "./repositories/posts.commandRepo";
import { PostsQueryRepo } from "./repositories/posts.queryRepo";

@Injectable()
export class PostsService {
  constructor(
    protected blogQueryRepo: BlogsQueryRepo,
    protected postCommandRepo: PostsCommandRepo,
    protected postQueryRepo: PostsQueryRepo,
  ) {}
  async create(createPostDto: CreatePostWithBlogIdDto) {
    const findBlog = await this.blogQueryRepo.findOne(createPostDto.blogId);
    if (!findBlog) {
      return;
    }

    const post = {
      ...createPostDto,
      createdAt: new Date(),
    };

    return await this.postCommandRepo.create(post);
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const findPost = await this.postQueryRepo.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
