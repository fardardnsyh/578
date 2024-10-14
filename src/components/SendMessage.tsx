"use client"
import { Button } from '@/components/ui/button'
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import axios from "axios"
import { Loader2 } from 'lucide-react'
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog'

export default function SendMessages({ username }: { username?: string }){
  const [flag, setFlag] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [data, setData] = useState({
    username: "",
    message: ""
  })

  useEffect(() => {
    if(username){
      setData(prev => ({
        ...prev,
         username
      }))
    }
  },[username])
  
  useEffect(() => {
    buttonRef.current
    if(flag && buttonRef.current){
      buttonRef.current.click();
    }
    setFlag(false)
  },[flag])
  
  const handleCancle = () => {
    setData({
      username: username || "",
      message: ""
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendMessage = async() => {
    try {
      if(data.username.length < 3 && data.message.length < 10){
        toast.error("Please provide a valid username and message")
        return;
      }
      setIsSubmitting(true);
      const messageResponse = await axios.post('/api/sendMessages', data)
      if(messageResponse.data?.success){
        setFlag(true)
        toast.success("Message sent successfully!")
      } else{
        toast.error("Can't send message");
        return;
      }
    } catch (error) {
      toast.error("Please try again later")
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className={`${!username ? "flex justify-between items-center w-full p-5" : ""}`}>
      { !username && 
        <h1 className='text-xl font-semibold'>
          Your messages
        </h1>
      }
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Send Message</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className='rounded-lg min-w-[23rem] min-h-[25rem] lg:min-w-[50rem] lg:min-h-[30rem]'>
          <AlertDialogHeader>
            <AlertDialogTitle>Send message</AlertDialogTitle>
            <AlertDialogDescription/>
            { !username && 
              <Input
              name='username'
              placeholder='Reciever username' 
              onChange={handleChange} 
              className='text-sm' 
              />
            }
            <Textarea 
              name='message'
              className='h-96 text-sm' 
              placeholder='Your message'
              onChange={handleChange}
            />
          </AlertDialogHeader>
          <AlertDialogFooter className=' top-0'>
            <AlertDialogCancel onClick={handleCancle}>
              Cancel
            </AlertDialogCancel>
            <Button onClick={handleSendMessage} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='animate-spin w-3 h-3 mr-3' /> Please wait
                </>
              ) : (
                <>
                  Send message
                </>
              )}
            </Button>
            <AlertDialogAction ref={buttonRef} className='hidden'>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
