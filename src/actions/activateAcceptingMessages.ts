'use server'
import db from "@/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

async function updateUserSetting(userId: string, data: Record<string, any>, successMessage: string) {
  try {
    await db.user.update({
      where: { id: userId },
      data: data,
    });
    return {
      success: true,
      message: successMessage,
    };
  } catch (error) {
    console.error("Database update error:", error);
    return {
      success: false,
      message: "Please try again later.",
    };
  }
}

async function getSessionAndUserId() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id) {
    return {
      success: false,
      message: "Please login to continue",
    };
  }
  return {
    success: true,
    userId: session.user.id,
  };
}

export async function changeAcceptMessage(value: boolean) {
  const sessionResult = await getSessionAndUserId();
  if (!sessionResult.success) return sessionResult;

  return updateUserSetting(
    sessionResult.userId || '',
    { isAcceptingMessage: value },
    "Accepting messages updated successfully"
  );
}

export async function changeAccountVisibility(value: boolean) {
  const sessionResult = await getSessionAndUserId();
  if (!sessionResult.success) return sessionResult;

  return updateUserSetting(
    sessionResult.userId || "",
    { isUsernameVisible: value },
    "Account visibility updated successfully"
  );
}
