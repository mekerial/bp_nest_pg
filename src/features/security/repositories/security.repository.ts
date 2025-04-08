import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Session } from "../entites/session.entity";
import { Repository } from "typeorm";

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(Session) protected sessionRepository: Repository<Session>,
  ) {}

  async createSession(
    ip: string,
    deviceId: string,
    deviceTitle: string,
    userId: number,
    refreshToken: string,
  ) {
    const issuedAt = new Date().toISOString();
    const deviceName = deviceTitle;
    const lastActiveDate = issuedAt;
    await this.sessionRepository.save({
      issuedAt,
      lastActiveDate,
      deviceId,
      ip,
      deviceName,
      userId,
      refreshToken,
    });
    return;
  }

  async getSessionByRefreshToken(refreshToken: string) {
    const result = await this.sessionRepository.find({
      where: { refreshToken: refreshToken },
    });
    if (!result[0]) {
      return null;
    }

    return result[0];
  }

  async updateSession(
    ip: string,
    issuedAt: Date,
    deviceId: string,
    deviceName: string,
    userId: number,
    refreshToken: string,
    newRefreshToken: string,
  ) {
    console.log("updating session");
    const lastActiveDate = new Date().toISOString();
    const sessionId = await this.sessionRepository.find({
      where: { refreshToken: refreshToken },
    });

    if (!sessionId[0]) {
      console.log("not found session");
      return;
    }

    console.log("updating session5");
    const result = await this.sessionRepository.update(refreshToken, {
      issuedAt,
      lastActiveDate,
      deviceId,
      ip,
      deviceName,
      userId,
      refreshToken: newRefreshToken,
    });
    console.log("success update session");
    return;
  }

  async deleteSessionByRefreshToken(refreshToken: string) {
    const session = await this.getSessionByRefreshToken(refreshToken);

    const result = await this.sessionRepository.delete(session.id);

    if (!result) {
      return null;
    }

    return true;
  }
}
