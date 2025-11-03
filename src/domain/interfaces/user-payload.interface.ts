export interface UserPayload {
  id: string;
  email: string;
  role: 'admin' | 'student' | 'supervisor' | 'accountant';
  status?: 'active' | 'inactive' | 'blocked';
  iat?: number; 
  exp?: number; 
}
