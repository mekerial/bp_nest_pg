import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./features/users/users.module";
import { BlogsModule } from "./features/blogs/blogs.module";
import { PostsModule } from "./features/posts/posts.module";
import { UtilsModule } from "./features/utils/utils.module";
import { AuthModule } from "./features/auth/auth.module";
import { SecurityModule } from "./features/security/security.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "127.0.0.1",
      port: 5432,
      username: "postgres",
      password: "sa",
      database: "bp0",
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    BlogsModule,
    PostsModule,
    UtilsModule,
    AuthModule,
    SecurityModule,
  ],
})
export class AppModule {}
