import type { InferSchemaType } from "mongoose";
import { model } from "mongoose";
import { messageSchema } from "../schemas/message.schema.ts";

type MessageSchema = InferSchemaType<typeof messageSchema>;

const Message = model<MessageSchema>("Message", messageSchema);

export default Message;
