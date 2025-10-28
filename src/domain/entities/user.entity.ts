export class UserEntity {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  isApprovedByAdmin: boolean;
  otpCode?: string;
  otpExpiresAt?: Date;
}
