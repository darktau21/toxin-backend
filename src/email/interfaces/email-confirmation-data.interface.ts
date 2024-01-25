export interface IEmailConfirmationData {
  code: string;
  createdAt: Date;
  expiresIn: Date;
  newEmail: string;
  userId: string;
}
