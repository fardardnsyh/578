import RadialGradient from '@/components/ui/radial-gradient'

const content = [
  { key: 1, Heading: "About us", data: "Welcome to VeliChat, the place where you can express yourself freely and send messages anonymously to anyone. Whether it's sharing your thoughts, sending a compliment, or leaving an encouraging note, our platform gives you a way to communicate without revealing your identity." },
  { key: 2, Heading: "Our mission", data: "We believe in the power of words and the importance of free expression. Our goal is to create a platform that promotes communication, kindness, and understanding while maintaining privacy." },
  { key: 3, Heading: "Safety & Respect", data: "We are committed to ensuring that Velichat remains a positive space. While we allow anonymous messaging, we have strict guidelines against hate speech, harassment, or harmful behavior. We encourage users to communicate respectfully and responsibly."}
]

export default function HomePage() {
  return (
    <div className="bg-background relative flex size-full w-screen h-screen items-center justify-center overflow-hidden rounded-lg border p-5 md:p-10" >
      <div className="size-full flex flex-col justify-center items-start max-w-4xl overflow-hidden">
        {content.map(para => (
          <div key={para.key}>
            <p className="z-10 whitespace-pre-wrap font-semibold text-2xl md:text-4xl tracking-tighter text-black mt-7 dark:text-white">
              {para.Heading}
            </p>
            <p className="z-10 whitespace-pre-wrap font-medium text-lg md:text-xl text-gray-700 mt-3 dark:text-white">
              {para.data}
            </p>
          </div>
        ))}
       <RadialGradient />
      </div>
    </div>
  )
}
