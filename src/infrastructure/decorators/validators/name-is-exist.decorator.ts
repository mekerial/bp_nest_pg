import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { Injectable } from "@nestjs/common";
import { UsersQueryRepo } from "../../../features/users/repositories/users.queryRepo";

@ValidatorConstraint({ name: "NameIsExist", async: true })
@Injectable()
export class NameIsExistConstraint implements ValidatorConstraintInterface {
  constructor(protected usersQueryRepo: UsersQueryRepo) {}
  async validate(login: string) {
    if (!this.usersQueryRepo) {
      console.error("usersQueryRepo не инициализирован!");
      return false;
    }
    const nameIsExist = await this.usersQueryRepo.nameIsExist(login);

    return !nameIsExist;
  }

  defaultMessage(): string {
    return "login already exist";
  }
}

export function NameIsExist(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: NameIsExistConstraint,
    });
  };
}
