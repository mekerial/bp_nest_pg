import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { PasswordService } from "../../applications/password.service";
import { UsersQueryRepo } from "./repositories/users.queryRepo";
import { UsersCommandRepo } from "./repositories/users.commandRepo";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, PasswordService, UsersQueryRepo, UsersCommandRepo],
  controllers: [UsersController],
})
export class UsersModule {}
