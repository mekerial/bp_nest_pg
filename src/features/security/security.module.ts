import { Module } from "@nestjs/common";
import { SecurityService } from "./security.service";
import { SecurityController } from "./security.controller";
import { SessionRepository } from "./repositories/security.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Session } from "./entites/session.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  controllers: [SecurityController],
  providers: [SecurityService, SessionRepository],
})
export class SecurityModule {}
