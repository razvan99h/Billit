export interface ChangePasswordRequest {
  userId: string;
  oldPassword: string;
  newPassword: string;
}
