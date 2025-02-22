import { PartialType } from "@nestjs/mapped-types";
import { CreateBlogDto } from "./create-blog.dto";

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  name?: string;
  description?: string;
  websiteUrl?: string;
}
