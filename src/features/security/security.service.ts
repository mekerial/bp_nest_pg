import { Injectable } from "@nestjs/common";
import { SessionRepository } from "./repositories/security.repository";

@Injectable()
export class SecurityService {
  constructor(protected sessionRepository: SessionRepository) {}

  async createSession(
    ip: string,
    deviceTitle: string,
    deviceId: string,
    userId: number,
    refreshToken: string,
  ) {
    await this.sessionRepository.createSession(
      ip,
      deviceId,
      deviceTitle,
      userId,
      refreshToken,
    );
    return;
  }
}
