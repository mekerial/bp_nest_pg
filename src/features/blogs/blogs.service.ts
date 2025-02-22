import { Injectable } from "@nestjs/common";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { BlogsCommandRepo } from "./repositories/blogs.commandRepo";
import { BlogsQueryRepo } from "./repositories/blogs.queryRepo";
import { PostsQueryRepo } from "../posts/repositories/posts.queryRepo";
import { QueryInputPostDto } from "../posts/dto/query-input-post.dto";

@Injectable()
export class BlogsService {
  constructor(
    protected blogsCommandRepo: BlogsCommandRepo,
    protected blogsQueryRepo: BlogsQueryRepo,
    protected postsQueryRepo: PostsQueryRepo,
  ) {}

  async create(createBlogDto: CreateBlogDto) {
    const newBlog = {
      ...createBlogDto,
      createdAt: new Date(),
      isMembership: false,
    };
    const createBlog = await this.blogsCommandRepo.create(newBlog);
    return createBlog;
  }

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    const blog = await this.blogsQueryRepo.findOne(id);
    if (!blog) {
      return null;
    }

    const updatedBlog = {
      ...updateBlogDto,
    };
    return await this.blogsCommandRepo.update(id, updatedBlog);
  }

  async remove(id: number) {
    return await this.blogsCommandRepo.remove(id);
  }

  async getAllPostsByBlogId(blogId: number, sortData: QueryInputPostDto) {
    const blog = await this.blogsQueryRepo.findOne(blogId);
    if (!blog) {
      return;
    }
    const posts = await this.postsQueryRepo.getAllPostsByBlog(blogId, sortData);
    return posts;
  }
}
