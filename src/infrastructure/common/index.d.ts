import { User } from "../../features/users/user.entity";

declare global {
  declare namespace Express {
    export interface Request {
      userId: User | string | null;
    }
  }
}
