import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostWithBlogIdDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { PostsQueryRepo } from "./repositories/posts.queryRepo";
import { QueryInputPostDto } from "./dto/query-input-post.dto";

@Controller("posts")
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsQueryRepo: PostsQueryRepo,
  ) {}

  @Post()
  async create(@Body() createPostDto: CreatePostWithBlogIdDto) {
    return await this.postsService.create(createPostDto);
  }

  @Get()
  async findAll(@Query() sortData: QueryInputPostDto) {
    return await this.postsQueryRepo.findAll(sortData);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    if (isNaN(+id)) {
      throw new BadRequestException("Invalid ID format");
    }

    const post = await this.postsQueryRepo.findOne(+id);
    if (!post[0]) {
      throw new NotFoundException();
    }
    return post;
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updatePostDto: UpdatePostDto) {
    if (isNaN(+id)) {
      throw new BadRequestException("Invalid ID format");
    }
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    if (isNaN(+id)) {
      throw new BadRequestException("Invalid ID format");
    }
    return this.postsService.remove(+id);
  }
}
