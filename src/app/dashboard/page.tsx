'use client'
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { getUserDatails } from '@/actions/getUserDetails';
import { changeAcceptMessage, changeAccountVisibility } from '@/actions/activateAcceptingMessages';
export default function HomePage(){
  const router = useRouter();
  const [username, setUsername] = useState('')
  const [isAcceptingMessage, setIsAcceptingMessage] = useState(false);
  const [isAccountVisible, setIsAccoutVisible] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        router.replace('/signin');
      } else {
        setUsername(session.user.username || "")
        setIsAcceptingMessage(session.user.isAcceptingMessages || true)
        console.log(session)
      }
    };
    checkSession();
  }, [router]);

  useEffect(() => {
    const updateSettings = () => {
      changeAccountVisibility(isAccountVisible);
    }
    updateSettings();
  },[isAccountVisible])

  useEffect(() => {
    const updateSettings = () => {
      changeAcceptMessage(isAcceptingMessage)
    }
    updateSettings();
  },[isAcceptingMessage])

  useEffect(() => {
    const getUser = async() => {
      const user = await getUserDatails();
      if(user.success){
        setIsAcceptingMessage(user.data?.isAcceptingMessage || true);
        setIsAccoutVisible(user.data?.isUsernameVisible || true);
      }
    }
    getUser();
  },[]) 
  console.log(isAcceptingMessage);
  return (
    <div className="bg-background relative flex size-full w-screen h-auto pt-16 items-center justify-center overflow-hidden rounded-lg" >
      <div className="size-full flex flex-col items-start max-w-5xl overflow-hidden">
        <h1 className='text-2xl font-semibold pl-10 lg:pl-0 mt-10'>Hey {username}</h1>
        <div className='mt-10 pl-10 lg:pl-0 flex flex-col md:flex-row gap-10'>
          <div className="flex items-center space-x-2">
            <Switch 
              id="airplane-mode" 
              checked={isAcceptingMessage} 
              onCheckedChange={() => setIsAcceptingMessage(prev => !prev)} />
            <Label htmlFor="airplane-mode">Accept messages</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="airplane-mode" 
              checked={isAccountVisible}
              onCheckedChange={() => setIsAccoutVisible(prev => !prev)}
            />
            <Label htmlFor="airplane-mode">Account Visible</Label>
          </div>
        </div>
      </div>
    </div>
  )
}
