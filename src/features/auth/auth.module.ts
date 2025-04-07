import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersService } from "../users/users.service";
import { PasswordService } from "../../applications/password.service";
import { UsersCommandRepo } from "../users/repositories/users.commandRepo";
import { UsersQueryRepo } from "../users/repositories/users.queryRepo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/user.entity";
import { JwtService } from "../../applications/jwt.service";
import { NameIsExistConstraint } from "../../infrastructure/decorators/validators/name-is-exist.decorator";
import { EmailIsExistConstraint } from "../../infrastructure/decorators/validators/email-is-exist.decorator";
import { EmailConfirmByCodeMiddleware } from "./middlewares/email-confirm-by-code.middleware";
import { Repository } from "typeorm";
import { SecurityService } from "../security/security.service";
import { SessionRepository } from "../security/repositories/security.repository";
import { Session } from "../security/entites/session.entity";
import { RefreshToken } from "./entities/refreshToken.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Session, RefreshToken])],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    SecurityService,
    SessionRepository,
    UsersCommandRepo,
    UsersQueryRepo,
    PasswordService,
    JwtService,
    NameIsExistConstraint,
    EmailIsExistConstraint,
    EmailConfirmByCodeMiddleware,
    Repository,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(EmailConfirmByCodeMiddleware).forRoutes({
      path: "/auth/registration-confirmation",
      method: RequestMethod.POST,
    });
  }
}
