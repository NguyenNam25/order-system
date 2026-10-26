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
  password: string;
  phone: string;
}

export interface UserCreate extends UserRegister {
  role: "USER" | "ADMIN";
}

export interface UserUpdate {
  fullname: string;
  email: string;
  phone: string;
}

// User tự đổi mật khẩu
export interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
}

// Form đổi mật khẩu của User
export type ChangePassForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// Thông tin người dùng được chọn trong dialog Admin
export interface AdminPasswordUpdate {
  id: number;
  fullname: string;
}

// Dữ liệu mật khẩu Admin gửi lên API
export interface AdminPassword {
  newPassword: string;
}

// Payload mutation dành cho Admin
export interface AdminChangePassword {
  id: number;
  password: AdminPassword;
}