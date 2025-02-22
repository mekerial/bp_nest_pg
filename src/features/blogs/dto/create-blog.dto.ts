import { IsString, Length, Matches } from "class-validator";
import { Trim } from "../../../infrastructure/decorators/transform/trim";

export class CreateBlogDto {
  @IsString()
  @Trim()
  @Length(1, 15, { message: "Length name is incorrect!" })
  name: string;

  @IsString()
  @Length(1, 100, { message: "Length description is incorrect!" })
  description: string;

  @IsString()
  @Length(1, 100, { message: "Length websiteUrl is incorrect!" })
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
    {
      message: "The websiteUrl must be a valid HTTPS URL!",
    },
  )
  websiteUrl: string;
}
