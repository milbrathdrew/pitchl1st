// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"

interface ExtendedSession extends Session {
  accessToken?: string
}

interface ExtendedJWT extends JWT {
  accessToken?: string
}

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/gmail.modify'
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account }): Promise<ExtendedJWT> {
      if (account) {
        token.accessToken = account.access_token
      }
      return token as ExtendedJWT
    },
    async session({ session, token }): Promise<ExtendedSession> {
      (session as ExtendedSession).accessToken = (token as ExtendedJWT).accessToken
      return session as ExtendedSession
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
