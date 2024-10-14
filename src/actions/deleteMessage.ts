"use server";
import db from "@/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function deleteMessages(messageId: string) {
  try {
    const session = await getServerSession(authOptions);
    const loggedInUsername = session?.user.username
    if (!loggedInUsername) {
      return {
        success: false,
        message: "Please login to continue",
      };
    }
    const messages = await db.message.delete({
      where: { id: messageId }
    });
    return {
      success: true,
      message: "Messages fetched successfully",
      data: messages,
    };  
  } catch (error) {
    console.log("Error while deleting message", error)
    return {
      succcess: true,
      message: "Error while deleting message"
    }
  }
  
}
