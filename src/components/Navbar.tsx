"use client"
import Link from "next/link"
import { Menu, UserCircle2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { toast } from "sonner"

const navlinks = [
  { key: 1, name: "Home", href: "/" },
  { key: 2, name: "Messages", href: "/messages" },
  { key: 3, name: "Find Users", href: "/findUsers" },
  { key: 4, name: "Dashboard", href: "/dashboard" },
  { key: 5, name: "About", href: "/about" }
]

export function GlassNavbar() {
  const pathname = usePathname();
  const session = useSession();
  const user = session.data
  const logoutHandler = async() => {
    try {
      await signOut({
        redirect: false
      });
      toast.success("Account logged out successfully!") 
    } catch (error) {
      toast.error("Something Went wrong. Please try again")
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl ml-6 mt-8 font-semibold text-primary">VeliChat</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navlinks.map((item) => (
                  <Link href={item.href} key={item.key} 
                    className={`${pathname === item.href ? "text-[#5046e6] font-bold": "text-black"} px-3 py-2 rounded-md text-sm font-medium`}>{item.name}</Link>
                ))}
              </div>
            </div>
          </div>
          <div>
            { !user && pathname !== "/signin" && 
            <Link href='/signin' className="text-primary border-primary outline-black px-4 py-2 border-black border-[1px] rounded-md hover:bg-primary hover:text-primary-foreground">
              Login
            </Link>
            }
          </div>
          { user && <div className="">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Menu className="block md:hidden box-border border-black" />
                <UserCircle2 className="hidden md:block lg:block"/>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-4">
                {navlinks.map((item) => (
                  <DropdownMenuItem key={item.key}>
                    <Link href={item.href}>{item.name}</Link>
                   </DropdownMenuItem>
                ))}
                <DropdownMenuItem className="cursor-pointer" onClick={logoutHandler}>
                  <p>Logout</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          }
        </div>
      </div>
    </nav>
  )
}
