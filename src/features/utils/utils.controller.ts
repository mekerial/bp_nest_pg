import { Controller, Delete, HttpCode, HttpException } from "@nestjs/common";
import { DataSource } from "typeorm";

@Controller("testing")
export class UtilsController {
  constructor(private readonly dataSource: DataSource) {}

  @Delete("all-data")
  @HttpCode(204)
  async dropDatabase() {
    try {
      const entities = this.dataSource.entityMetadatas;
      for (const entity of entities) {
        const repository = this.dataSource.getRepository(entity.name);
        await repository.query(
          `TRUNCATE "${entity.tableName}" RESTART IDENTITY CASCADE;`,
        );
      }
      return { message: "Database wiped successfully" };
    } catch (error) {
      throw new HttpException("Error wiping database: " + error, 500);
    }
  }
}
