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
  UseFilters,
  UseGuards,
  HttpCode,
} from "@nestjs/common";
import { CreateUserInputType } from "./types/create-user-input.type";
import { UsersService } from "./users.service";
import { QueryInputUserType } from "./types/query-input-user.type";
import { UsersQueryRepo } from "./repositories/users.queryRepo";
import { HttpExceptionFilter } from "../../infrastructure/exception-filters/http-exception-filter";
import { BasicAuthGuard } from "../../infrastructure/guards/basic-auth.guard";

@UseGuards(BasicAuthGuard)
@UseFilters(HttpExceptionFilter)
@Controller("sa/users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepo: UsersQueryRepo,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserInputType) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(@Query() sortData: QueryInputUserType) {
    return await this.usersQueryRepo.find(sortData);
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
  @HttpCode(204)
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
