export interface User {
  id: number;
  fullname: string;
  email: string;
  password: string;
}
export interface UserRegister {
  fullname: string;
  email: string;
  password: string;
}

export interface UserUpdate {
  fullname: string;
  email: string;
}

export interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
}
