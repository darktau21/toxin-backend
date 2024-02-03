export interface IEmailConfirmationData {
  code: string;
  createdAt: Date;
  expiresIn?: Date;
  newEmail: string;
  requestedAt?: Date;
  userId: string;
}
