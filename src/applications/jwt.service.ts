import * as jwt from "jsonwebtoken";

export class JwtService {
  constructor() {}
  async createAccessJWT(userId: number) {
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    return accessToken;
  }
}
