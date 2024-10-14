"use server";
import db from "@/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function getUserDatails() {
  try {
    const session = await getServerSession(authOptions);
    const loggedInUsername = session?.user.username
    if (!loggedInUsername) {
      return {
        success: false,
        message: "Please login to continue",
      };
    }
    const userDetails = await db.user.findFirst({
      where: {
        id: session.user.id
      },
      select: {
        isUsernameVisible: true,
        isAcceptingMessage: true
      }
    });
    return {
      success: true,
      message: "User details fetched successfully",
      data: userDetails,
    }; 
  } catch (error) {
    console.log("Error while recieving messages") 
    return {
      success: false,
      message: "Cannot get messages"
    }
  }
}
