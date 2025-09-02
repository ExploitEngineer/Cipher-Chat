import type { Request, Response } from "express";
import Message from "../models/message.model.ts";
import cloudinary from "../lib/cloudinary.ts";
import { getReceiverSocketId, io } from "../lib/socket.ts";

export const getMessages = async (req: Request, res: Response) => {
  try {
    const {
      params: { id: userToChatId },
    } = req;

    const myId = (req as any).user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 }); // sort by oldest -> newest

    res.status(200).json(messages);
  } catch (err) {
    if (err instanceof Error) {
      console.log("Error in getMessages controller: ", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const {
      body: { text, image },
      params: { id: receiverId },
    } = req;

    const senderId = (req as any).user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // todo: realtime functionality goes here => socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (err) {
    if (err instanceof Error) {
      console.log("Error in sendMessage controller: ", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
