export interface User {
  id?: number;
  username: string;
  password?: string;
  email: string;
  fullName: string;
  active?: boolean;
  roles?: Role[];
  createdAt?: string;
}

export interface Role {
  id?: number;
  roleName: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
  roles: string[];
}
