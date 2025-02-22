export class CreatePostWithoutIdDto {
  title: string;
  shortDescription: string;
  content: string;
}

export class CreatePostWithBlogIdDto extends CreatePostWithoutIdDto {
  blogId: number;
}

export class CreatePostWithBlogIdWithDateDto extends CreatePostWithBlogIdDto {
  createdAt: Date;
}
