export class UserEntity {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  role: 'admin' | 'etudiant' | 'surveillant' | 'comptabilite';
  status: 'actif' | 'inactif' | 'bloque';

  isEmailVerified: boolean;
  isApprovedByAdmin: boolean;
  otpCode?: string;
  otpExpiresAt?: Date;
}
