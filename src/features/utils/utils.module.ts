import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/user.entity";
import { UtilsController } from "./utils.controller";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UtilsController],
})
export class UtilsModule {}
