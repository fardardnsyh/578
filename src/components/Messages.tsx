"use client"
import { getMessages } from "@/actions/getMessages";
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { useEffect, useState } from "react";
import { SquareX } from "lucide-react";
import { deleteMessages } from "@/actions/deleteMessage";

type Message = {
  id: string;
  message: string;
}

export  function Messages() {
  const router = useRouter()
  const session = useSession();
  const [isMessagesExist, setIsMessagesExist] = useState('')
  const userData = session.data?.user
  const [messaages, setMessages] = useState<Message[]>([])

  if(!userData?.username){
    router.replace("/signin");
  }

  const fetchMessages = async() => {
    const response = await getMessages(userData?.username || ""); 
    if(!response.success){
      setIsMessagesExist(response.message || "")
    }
    if(response?.success){
      setMessages(response?.data || [])
    }
  }

  useEffect(() => {
    try {
      fetchMessages();
      
      const interval = setInterval(() => {
        fetchMessages();
      }, 5000)

      return () => clearInterval(interval)  
    } catch (error) {
      console.log("Error while fetching messages")
    }
  },[userData?.username])

  console.log(isMessagesExist)
  if(messaages.length < 1){
    return (
      <div className="p-6 flex flex-wrap gap-3">
        No messages available
      </div>
    )
  }
  
  return (
    <div className="p-4 flex flex-wrap gap-3">
      {messaages && messaages.map((item, index) => {
        return MessageCard({ message: item.message, number: index, id: item.id });
      })}
    </div>
  )
}


interface CardProps {
  message: string;
  number: number;
  id: string;
}


function MessageCard({ message, number, id }: CardProps) {
  return (
    <Card className="w-[321px]">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-sm">Message {number + 1}</CardTitle>
          <SquareX 
            color="#991b11"
            className="cursor-pointer w-5 h-5"
            onClick={() => deleteMessages(id)}
          />
        </div>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
    </Card>
  )
}
