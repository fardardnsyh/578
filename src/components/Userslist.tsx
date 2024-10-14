"use client"

import { getAllusers } from "@/actions/findAllUsers"
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SendMessages from "./SendMessage";
import { Input } from "@/components/ui/input";

interface UserDataType {
  id: string;
  username: string;
}

export  function UsersList() {
  const router = useRouter()
  const { status } = useSession();
  const [selectUser, setSelectUser] = useState('')
  const [allUsers, setAllUsers] = useState<UserDataType[]>()
  const [filteredUsers, SetFilteredUsers] = useState<UserDataType[]>()

  useEffect(() => {
    const fetchUsers = async() => {
      try {
        const allUsers = await getAllusers();
        if(!allUsers.success){
          toast.error("Can't get users");
          return;
        }
        console.log(allUsers.data)
        setAllUsers(allUsers.data)
        SetFilteredUsers(allUsers.data)
      } catch (error) {
        console.log("Error");
      }
    }
    fetchUsers();
  },[])

  useEffect(() => {
    const filteredUsers = allUsers?.filter(item => item.username.includes(selectUser));
    SetFilteredUsers(filteredUsers)
  },[selectUser])

  useEffect(() => {
    if(status === "unauthenticated"){
      router.replace('/signin')
    }
  },[router, status])

  console.log(allUsers)
  if(!allUsers?.length){
    return (
      <div className="p-6 flex flex-wrap gap-3">
        No users available
      </div>
    )
  }
 
  return (
    <div className="mx-auto">
      <Input 
        className="w-72 md:w-96 ml-2" 
        placeholder="Search user" 
        onChange={(e) => setSelectUser(e.target.value)}
      />
      <div className="p-2 grid lg:grid-cols-3 h-auto sm:grid-cols-2 grid-cols-1 mx-auto gap-2">
        {filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map((item) => (
            <UserCard username={item.username} key={item.id} />
          ))
        ): (
          <p>No User found</p>
        )}
      </div>
    </div>
  )
}


interface CardProps {
  username: string;
}


function UserCard({ username }: CardProps) {
  return (
    <Card className="w-[310px] -p-5 mx-auto">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-sm mb-2 ml-2">{username}</CardTitle>
          <SendMessages username={username} />
        </div>
      </CardHeader>
    </Card>
  )
}
