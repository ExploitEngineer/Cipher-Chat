import { model } from "mongoose";
import type { InferSchemaType } from "mongoose";
import { userSchema } from "../schemas/user.schema.ts";

type UserType = InferSchemaType<typeof userSchema>;

const User = model<UserType>("User", userSchema);
export default User;
