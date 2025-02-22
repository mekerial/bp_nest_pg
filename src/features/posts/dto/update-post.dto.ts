import { PartialType } from "@nestjs/mapped-types";
import { CreatePostWithBlogIdDto } from "./create-post.dto";

export class UpdatePostDto extends PartialType(CreatePostWithBlogIdDto) {}
