export interface UserPayload {
  id: string;
  email: string;
  role: 'admin' | 'etudiant' | 'surveillant' | 'comptabilite';
  status?: 'actif' | 'inactif' | 'bloque';
  iat?: number; 
  exp?: number; 
}
