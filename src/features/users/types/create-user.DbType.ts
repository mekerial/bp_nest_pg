export class CreateUserDbType {
  login: string;
  email: string;
  password: string;
  passwordHash?: string;
  passwordSalt?: string;
  createdAt?: Date;
  confirmationCode?: string;
  codeExpirationDate?: Date | null;
  isConfirmed?: false;
}
