import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersService } from "../features/users/users.service";
import { PasswordService } from "../applications/password.service";
import { UsersCommandRepo } from "../features/users/repositories/users.commandRepo";
import { UsersQueryRepo } from "../features/users/repositories/users.queryRepo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../features/users/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    UsersCommandRepo,
    UsersQueryRepo,
    PasswordService,
  ],
})
export class AuthModule {}
