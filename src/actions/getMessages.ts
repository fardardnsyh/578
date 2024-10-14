"use server";
import db from "@/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function getMessages(username: string) {
  try {
    const session = await getServerSession(authOptions);
    const loggedInUsername = session?.user.username
    if (!loggedInUsername) {
      return {
        success: false,
        message: "Please login to continue",
      };
    }
    const messages = await db.message.findMany({
      where: {
        userId: username,
      },
      select: {
        id: true,
        message: true,
      },
    });
    if (messages.length === 0) {
      return {
        success: false,
        messages: "No messages available",
      };
    }
    return {
      success: true,
      message: "Messages fetched successfully",
      data: messages,
    }; 
  } catch (error) {
    console.log("Error while recieving messages") 
    return {
      success: false,
      message: "Cannot get messages"
    }
  }
}
