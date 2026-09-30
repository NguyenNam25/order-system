export interface User {
  id: number;
  fullname: string;
  email: string;
  role: "USER" | "ADMIN";
  password: string;
  phone: string;
}
export interface UserRegister {
  fullname: string;
  email: string;
  role: "USER" | "ADMIN";
  password: string;
  phone: string;
}

export interface UserUpdate {
  fullname: string;
  email: string;
  phone: string;
}

export interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
}
