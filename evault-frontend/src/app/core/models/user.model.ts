export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  path?: string;
}

export type UserRole =
  | 'SUPER_ADMIN'
  | 'INVESTIGATING_OFFICER'
  | 'PROSECUTOR'
  | 'JUDGE'
  | 'LAWYER'
  | 'COURT_STAFF'
  | 'VIEWER';

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  roleDisplayName: string;
  badgeNumber?: string;
  department?: string;
  phone?: string;
  active: boolean;
  createdAt: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  badgeNumber?: string;
  department?: string;
}
