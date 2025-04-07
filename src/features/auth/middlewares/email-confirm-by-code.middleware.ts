import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { Repository } from "typeorm";
import { User } from "../../users/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class EmailConfirmByCodeMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const user = await this.userRepository.findOne({
      where: {
        confirmationCode: req.body.code,
      },
    });
    if (!user) {
      return res.status(400).send({
        errorsMessages: [
          {
            message: "Invalid code",
            field: "code",
          },
        ],
      });
    }

    if (user.isConfirmed) {
      return res.status(400).send({
        errorsMessages: [
          {
            message: "Code already confirmed",
            field: "code",
          },
        ],
      });
    }
    next();
  }
}
