import { PartialType } from "@nestjs/mapped-types";
import { CreateAuthDto } from "./user-types";

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
