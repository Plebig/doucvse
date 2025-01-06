import type { Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"

type UserId = string

declare module 'next-auth/jwt'{
  interface JWT {
    id: UserId,
    role: string
  }
}

declare module 'next-auth' {
  interface User extends DefaultUser {
    role: string;
  }
  interface Session {
    user: User & {
      id: Userid,
      role: string
    }
  }
}