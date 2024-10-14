import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/db"
import { compare, hash } from "bcryptjs";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password", placeholder: "placeholder" }
      },
      async authorize(credentials: any): Promise<any> {
        console.log("credentials: ", credentials)
        try { 
          const user = await db.user.findFirst({
            where: {
              username: credentials.username
            }
          }) 
          if(user && (!await compare(credentials.password, user.password))){
            throw new Error("Incorrect password.")
          } else if(user && (await compare(credentials.password, user.password))){
            return {
              id: user.id,
              username: user.username,
              isAccecptingMessage: user.isAcceptingMessage
            }
          }
          console.log("User not in db");
          const hashedPassword = await hash(credentials.password, 10)
          const newUser = await db.user.create({
            data: {
              username: credentials.username,
              password: hashedPassword,
              isAcceptingMessage: true,
              isUsernameVisible: true
            }
          })
          console.log("New user created.");
          return {
            id: newUser.id,
            username: newUser.username,
            isAcceptingMessage: newUser.isAcceptingMessage
          }
        } catch (error: any) {
          throw new Error(error)
        }
      },
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if(user){
        token.id = user.id,
        token.username = user.username,
        token.isAcceptingMessages = user.isAcceptingMessages
      }
      console.log("jwt Token : ", token)
      return token
    },
    async session({ session, token }) {
      if(token){ 
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
      }
      return session
    }
  },
  pages: {
    signIn: "/signin"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
}
