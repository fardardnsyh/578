'use server'
import db from "@/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function getAllusers(){
  try {
    const session = await getServerSession(authOptions);
    if(!session || !session.user.id){
      return {
        success: false,
        messages: "Please login to continue"
      }
    }
    const allUsers = await db.user.findMany({
      where: {
        isAcceptingMessage: true,
        isUsernameVisible: true
      },
      select: {
        id: true,
        username: true
      }
    })
    return {
      success: true,
      message: "Accepting messages updated successfully",
      data: allUsers
    }
  } catch (error) {
    return {
      success: false,
      message: "Please try again later."
    }
  }
}
