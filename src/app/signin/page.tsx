"use client"
import { checkUniqueUsername } from '@/actions/checkUniqueUsername'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
import { getSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useDebounceCallback } from 'usehooks-ts'

enum AccountType {
  Existing,
  New
}

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameUniqueMessage, setUsernameUniqueMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>(AccountType.New)
  const buttonEnter = useRef<HTMLButtonElement>(null)
  const debouncedSetUsername = useDebounceCallback(setUsername, 500);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session && session.user) {
        router.replace('/');
      }
    };
    checkSession();
  }, [router]);

  
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if(event.key === "Enter"){
        buttonEnter.current?.click();
      }
    };
    document.addEventListener("keypress", handleKeyPress)
    return () => {
      document.removeEventListener("keypress", handleKeyPress)
    };
  },[])
  
  useEffect(() => {
    if(accountType === AccountType.Existing) return;
    const checkUsername = async () => {
      if(username === ""){
        return;
      };
      setIsCheckingUsername(true);
      setUsernameUniqueMessage('')
      try {
        const response = await checkUniqueUsername(username);
        if(!response.success){
          setUsernameUniqueMessage(response.message);
        }
        setUsernameUniqueMessage(response.message)
      } catch (error) {
        console.log(error)
      } finally{
        setIsCheckingUsername(false)
      }
    }
    checkUsername();
  },[username, accountType])

  const submitHandler = async () => {
    try {
      setIsSubmitting(true);
      if(username.length < 3){
        toast.error("Username to short");
        return;
      }
      if(password.length < 5){
        toast.error("Password to short");
        return;
      }
      const signInResponse = await signIn('credentials', {
        redirect: false,
        username: username.toLowerCase(),
        password: password
      })
      if(signInResponse?.error){
        toast.error("Try again later")
        return;
      }
      toast.success("Login successfully")
      setIsSubmitting(false);
      router.push('/')
    } catch (error) {
      toast.error("Try again latry")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Join VeliChat</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='w-full h-auto -mt-3 rounded-md b border'>
            <div className='p-2'>
              <Button
                onClick={() => setAccountType(AccountType.New)}
                className={`w-full mb-1 ${accountType === AccountType.New ? "bg-black text-white" : "bg-white text-black hover:bg-gray-200"}`}>
                Create an account
              </Button>
              <Button 
                onClick={() => setAccountType(AccountType.Existing)}
                className={`w-full ${accountType === AccountType.Existing ? "bg-black text-white" : "bg-white text-black hover:bg-gray-200"}`}>
                Login existing account
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2 mt-5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                required
                defaultValue={username} 
                onChange={(e) => {
                  if(accountType === AccountType.New){
                    debouncedSetUsername(e.target.value)
                  } else {
                    setUsername(e.target.value)
                  }
                }}
              />
              {isCheckingUsername && <Loader2 className='animate-spin' />}
              <p className={`${usernameUniqueMessage === "Username is unique" ? "text-green-700" : "text-red-700"}`}>
                {usernameUniqueMessage}
              </p>
            </div>
            <div className="grid relative gap-2">
                <Label htmlFor="password">Password</Label>
              <Input
                id="password" 
                type={isPasswordVisible ? "text" : "password" } 
                placeholder='Password' 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              { !isPasswordVisible ? (
                <EyeIcon className='absolute cursor-pointer right-2 top-8' color='#374151' size={20} 
                  onClick={() => setIsPasswordVisible(prev => !prev)}
                />
              ): (
                <EyeOffIcon className='absolute right-2 top-8 cursor-pointer' color='#374151' size={20}
                  onClick={() => setIsPasswordVisible(prev => !prev)}
                />
              )}
              
            </div>
            <Button className="w-full" onClick={submitHandler} disabled={isSubmitting} ref={buttonEnter}>
              {isSubmitting ? (
                <>
                  <Loader2 className='animate-spin w-3 h-3 mr-3' /> Please wait
                </>
              ) : (
                <>
                  {accountType === AccountType.New ? "Create account" : "Login"}
                </>
                 
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
