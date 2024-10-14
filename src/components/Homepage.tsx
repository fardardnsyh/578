import BoxReveal from '@/components/ui/box-reveal'
import { Button } from '@/components/ui/button'
import DotPattern from '@/components/ui/dot-pattern'
import WordRotate from '@/components/ui/word-rotate'
import { ny } from '@/lib/utils'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="bg-background relative flex size-full w-screen h-screen items-center justify-center overflow-hidden rounded-lg border p-10 md:p-20" >
      <div className="size-full flex flex-col justify-center items-start max-w-4xl overflow-hidden pt-8">
        <BoxReveal boxColor="#5046e6" duration={0.5}>
          <div className='flex'>
            <p className="text-[2.5rem] md:text-[3.5rem] font-semibold">
              Send Messages Anonymously 
              <span className="text-[#5046e6]">.</span>
              <WordRotate
                 className=" text-3xl md:text-5xl font-extrabold text-black dark:text-white"
                 words={['Connect Freely!', 'Engage Securely!']}
              />
            </p>          
          </div>
        </BoxReveal>
        <BoxReveal boxColor="#5046e6" duration={0.5}>
          <h2 className="mt-[.5rem] text-[1rem]">
            Register with a Username,
              {' '}
              <span className="text-[#5046e6]">No Personal Details Needed!</span>
          </h2>
        </BoxReveal>
        <BoxReveal boxColor="#5046e6" duration={0.5}>
          <div className="mt-6">
            <p>
              &quot;We are a platform for anonymous and secure messaging, allowing you to connect and express yourself  
              <span className="font-semibold text-[#5046e6]"> freely </span>
              without sharing personal details.
              <span className="font-semibold text-[#5046e6]"> Privacy</span>
              ,
              <span className="font-semibold text-[#5046e6]"> Simplicity</span>
              ,
              and 
              <span className="font-semibold text-[#5046e6]"> Safety </span>
              {' '}
              are at the heart of what we do.&quot;
              {' '}
            </p>
          </div>
        </BoxReveal>
        <BoxReveal boxColor="#5046e6" duration={0.5}>
          <Button className="mt-[1.6rem] bg-[#5046e6]">
            <Link href="/messages">Send Messages</Link>
          </Button>
        </BoxReveal>
      </div>
      <DotPattern
        className={ny(
          '[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]',
          )}
        />
    </div>
   )
}
