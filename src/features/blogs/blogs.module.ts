import { Module } from "@nestjs/common";
import { BlogsService } from "./blogs.service";
import { BlogsController } from "./blogs.controller";
import { BlogsCommandRepo } from "./repositories/blogs.commandRepo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Blog } from "./entities/blog.entity";
import { BlogsQueryRepo } from "./repositories/blogs.queryRepo";
import { PostsQueryRepo } from "../posts/repositories/posts.queryRepo";
import { Post } from "../posts/entities/post.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Blog, Post])],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsCommandRepo, BlogsQueryRepo, PostsQueryRepo],
})
export class BlogsModule {}
