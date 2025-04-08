import * as jwt from "jsonwebtoken";
import * as process from "process";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RefreshToken } from "../features/auth/entities/refreshToken.entity";
import { SessionRepository } from "../features/security/repositories/security.repository";
import { Session } from "../features/security/entites/session.entity";

export class JwtService {
  constructor(
    @InjectRepository(RefreshToken)
    protected refreshTokenRepository: Repository<RefreshToken>,
    protected sessionRepository: SessionRepository,
  ) {}
  createAccessJWT(userId: number) {
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "10s",
    });
    return accessToken;
  }

  async createRefreshJWT(userId: number, deviceId: string) {
    const refreshTokenWithId = {
      userId: userId,
      refreshToken: jwt.sign(
        { userId: userId, deviceId: deviceId },
        process.env.REFRESH_SECRET,
        { expiresIn: "21s" },
      ),
    };
    await this.refreshTokenRepository.save(refreshTokenWithId);
    return refreshTokenWithId.refreshToken;
  }

  getUserIdByAccessToken(token: string) {
    try {
      const result = jwt.verify(token, process.env.JWT_SECRET);
      return +result["userId"];
    } catch {
      return null;
    }
  }

  async updateAccessTokenByRefreshToken(
    refreshToken: string,
    deviceId: string,
  ) {
    const result = await this.refreshTokenRepository.find({
      where: { refreshToken: refreshToken },
    });
    if (!result[0]) {
      return null;
    }
    const userId = await this.getUserIdByRefreshToken(refreshToken);
    if (!userId) {
      return null;
    }

    if (result[0].userId.toString() !== userId.toString()) {
      console.log("1 unsuccess update tokens!");
      return null;
    }

    if (result) {
      try {
        const verifyToken: any = jwt.verify(
          refreshToken,
          process.env.REFRESH_SECRET,
        );
        const newAccessToken = this.createAccessJWT(userId);
        const newRefreshToken = await this.createRefreshJWT(userId, deviceId);

        await this.refreshTokenRepository.delete(result[0].id);

        const session: Session =
          await this.sessionRepository.getSessionByRefreshToken(refreshToken);

        console.log("updating session in jwt");
        await this.sessionRepository.updateSession(
          session.ip,
          session.issuedAt,
          session.deviceId,
          session.deviceName,
          session.userId.toString(),
          refreshToken,
          newRefreshToken,
        );

        console.log("success update tokens!");

        return {
          userId: verifyToken.userId.toString(),
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        };
      } catch {
        console.log("2 unsuccess update tokens!");
        return null;
      }
    } else {
      console.log("3 unsuccess update tokens!");
      return null;
    }
  }

  private async getUserIdByRefreshToken(refreshToken: string) {
    try {
      const result: any = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      const getRefreshToken = await this.refreshTokenRepository.find({
        where: { refreshToken: refreshToken },
      });

      if (getRefreshToken[0]) {
        return result.userId;
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }

  async revokeRefreshToken(refreshToken: string) {
    const result = await this.refreshTokenRepository.find({
      where: { refreshToken: refreshToken },
    });

    if (!result[0]) {
      return null;
    }

    const userId = await this.getUserIdByRefreshToken(refreshToken);
    if (!userId) {
      return null;
    }
    if (result[0].userId.toString() !== userId.toString()) {
      return null;
    }

    if (result) {
      try {
        const verifyToken: any = jwt.verify(
          refreshToken,
          process.env.REFRESH_SECRET,
        );

        await this.refreshTokenRepository.delete(result[0].id);
        console.log("success delete token! logout");

        return verifyToken;
      } catch {
        return null;
      }
    } else {
      console.log("else");
      return null;
    }
  }
}
