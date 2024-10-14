import "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAcceptingMessages?: boolean;
      username?: string;
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id: string;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}
