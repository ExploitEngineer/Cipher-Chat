type UserStatus = "offline" | "online";

export interface AuthUserData {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePic?: string | null;
  status?: UserStatus;
  resetPasswordExpires?: Date | undefined;
  resetPasswordToken?: string | undefined;
  createdAt?: string;
}
