import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { Injectable } from "@nestjs/common";
import { UsersQueryRepo } from "../../../features/users/repositories/users.queryRepo";

@ValidatorConstraint({ name: "EmailIsExist", async: false })
@Injectable()
export class EmailIsExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersQueryRepo: UsersQueryRepo) {}

  async validate(email: string) {
    const emailIsExist = await this.usersQueryRepo.emailIsExist(email);

    return !emailIsExist;
  }

  defaultMessage(): string {
    return "email already exist";
  }
}

export function EmailIsExist(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: EmailIsExistConstraint,
    });
  };
}
