import { Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { PostsQueryRepo } from "./repositories/posts.queryRepo";
import { PostsCommandRepo } from "./repositories/posts.commandRepo";
import { BlogsQueryRepo } from "../blogs/repositories/blogs.queryRepo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./entities/post.entity";
import { Blog } from "../blogs/entities/blog.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Post, Blog])],
  controllers: [PostsController],
  providers: [PostsService, PostsQueryRepo, PostsCommandRepo, BlogsQueryRepo],
})
export class PostsModule {}
