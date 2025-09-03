export interface AuthUserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePic?: string | null;
  resetPasswordExpires?: Date | undefined;
  resetPasswordToken?: string | undefined;
  lastSeen: Date;
  createdAt?: string;
}
