import db from "@/db";
import { authOptions } from "@/lib/auth";
import { messageImputSchema, messageInputProps } from "@/types";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
  try {
    const session = await getServerSession(authOptions);
    if(!session){
      return NextResponse.json({
        success: false,
        message: "Please login to send message"
      })
    }
    const { username , message }: messageInputProps = await req.json();
    const { success } = messageImputSchema.safeParse({ username, message });
    if(username.length < 3 && message.length < 10){
      return NextResponse.json({
        success: false,
        message: "Wrong inputs"
      })
    }
    if(!success){
      return NextResponse.json({
        success: false,
        message: "Incorrect inputs"
      })
    }
    const isUserExist = await db.user.findUnique({
      where: { username: username.toLowerCase() }
    })
    if(!isUserExist){
      return NextResponse.json({
        success: false,
        message: "No user found with this username"
      })
    }

    if(isUserExist && !isUserExist.isAcceptingMessage){
      return NextResponse.json({
        success: false,
        message: "User is not acceping messaages."
      })
    }

    const newMessage = await db.message.create({
      data: {
        userId: username.toLowerCase(),
        message
      }
    })
    await db.user.update({
      where: {
        username
      },
      data: {
        messages: { 
          connect: { 
            id: newMessage.id 
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: "Message sent successfully."
    })
  } catch (error) {  
    console.error("Error in sendMessages:", error); // Log the error  
    return NextResponse.json({  
      success: false,  
      message: "Try again after some time"  
     });  
  }
}
