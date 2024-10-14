"use client"
import { Messages } from '@/components/Messages';
import SendMessages from '@/components/SendMessage';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default function HomePage(){
  const router = useRouter();
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        router.replace('/signin');
      }
    };
    checkSession();
  }, [router]);
  return (
    <div className="bg-background relative flex size-full w-screen h-auto pt-16 items-center justify-center overflow-hidden rounded-lg" >
      <div className="size-full flex flex-col items-start max-w-5xl overflow-hidden">
        <SendMessages />
        <Messages />
      </div>
    </div>
  )
}
