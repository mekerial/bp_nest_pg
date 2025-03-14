import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
  Query,
  Req,
  BadRequestException,
} from "@nestjs/common";
import { BlogsService } from "./blogs.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { BlogsQueryRepo } from "./repositories/blogs.queryRepo";
import { QueryInputBlogDto } from "./dto/query-input-blog.dto";
import { Request } from "express";
import { PostsQueryRepo } from "../posts/repositories/posts.queryRepo";

@Controller("blogs")
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepo: BlogsQueryRepo,
    private readonly postsQueryRepo: PostsQueryRepo,
  ) {}

  @Post()
  async create(@Body() createBlogDto: CreateBlogDto) {
    return await this.blogsService.create(createBlogDto);
  }

  @Get()
  async findAll(@Query() sortData: QueryInputBlogDto) {
    return this.blogsQueryRepo.findAll(sortData);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    if (isNaN(+id)) {
      throw new BadRequestException("Invalid ID format");
    }
    return await this.blogsQueryRepo.findOne(+id);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() updateBlogDto: UpdateBlogDto) {
    if (isNaN(+id)) {
      throw new BadRequestException("Invalid ID format");
    }
    return await this.blogsService.update(+id, updateBlogDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    if (isNaN(+id)) {
      throw new BadRequestException("Invalid ID format");
    }
    return await this.blogsService.remove(+id);
  }

  @Get(":id/posts")
  async getAllPostsByBlog(
    @Param("id") blogId: string,
    @Query() sortData: QueryInputBlogDto,
    @Req() request: Request,
  ) {
    if (isNaN(+blogId)) {
      throw new BadRequestException("Invalid blogId format");
    }
    let accessToken;
    if (request.headers.authorization) {
      accessToken = request.headers.authorization.split(" ")[1];
    }
    const posts = await this.blogsService.getAllPostsByBlogId(
      +blogId,
      sortData,
    );
    if (!posts) {
      throw new NotFoundException(`Blog with id ${blogId} not found`);
    }
    return posts;
  }
}
