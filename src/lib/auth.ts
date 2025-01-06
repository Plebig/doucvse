import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "./dbR";
import { fetchRedis } from "@/helpers/redis";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Credentials are required");
        }

        const { email, password } = credentials;

        // Fetch user from Redis by email
        const dbUserResultId = await fetchRedis("get", `user:email:${email}`);
 
        if (!dbUserResultId) {
          throw new Error("Uživatel neexistuje");
        }

        const dbUserId = JSON.parse(dbUserResultId);

        const dbUserRaw = await fetchRedis("get", `user:${dbUserId}`)
        const dbUser = JSON.parse(dbUserRaw)

        // Check if password matches
        const isPasswordValid = await compare(password, dbUser.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          image: dbUser.image,
          role: dbUser.role
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // If user data is present (meaning this is during sign-in), attach it to the JWT token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.role = user.role;
      } else {
        // Fetch user data from Redis if it exists
        const dbUserResult = await fetchRedis("get", `user:${token.id}`);
        if (dbUserResult) {
          const dbUser = JSON.parse(dbUserResult) as User;
          token.id = dbUser.id;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.picture = dbUser.image;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Attach token data to the session so that it is available in the client session
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
        session.user.role = token.role as string;
      }

      return session;
    },
    redirect({ url, baseUrl }) {
      return baseUrl + "/dashboard";
    }
  },
};
