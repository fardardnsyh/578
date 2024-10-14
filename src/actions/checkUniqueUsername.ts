"use server"
import db from "@/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export const checkUniqueUsername = async (username: string) => {
  const session = await getServerSession(authOptions);
  if(session && session.user){
    return {
      success: false,
      message: "Already login"
    }
  }
  try {
    const isUsernameExist = await db.user.findFirst({
      where: {
        username
      }
    })
    if(isUsernameExist){
      return {
        success: false,
        message: "Username already taken"
      }
    }
    return {
      success: true,
      message: "Username is unique"
    }
  } catch (error) {
    return {
      success: false,
      message: "Error while check username unique"
    }
  }
}
