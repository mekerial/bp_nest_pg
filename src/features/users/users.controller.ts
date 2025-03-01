import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ParseIntPipe,
  Query,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./user.entity";
import { UsersService } from "./users.service";
import { QueryInputUserDto } from "./dto/query-input-blog.dto";
import { UsersQueryRepo } from "./repositories/users.queryRepo";

@Controller("sa/users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepo: UsersQueryRepo,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(@Query() sortData: QueryInputUserDto) {
    return await this.usersService.findAll(sortData);
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    if (isNaN(+id)) {
      throw new BadRequestException("Invalid ID format");
    }
    const user = await this.usersQueryRepo.findOne(+id);
    if (!user) {
      throw new NotFoundException();
    }
    return this.usersQueryRepo.findOne(+id);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    if (isNaN(+id)) {
      throw new BadRequestException("Invalid ID format");
    }
    const deletedUser = await this.usersService.remove(+id);
    if (!deletedUser) {
      throw new NotFoundException();
    }
    return deletedUser;
  }
}
