import NextAuth from "next-auth"
import prisma from "@/lib/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserById } from "@/lib/data"
import authConfig from "@/auth.config"


export const options = {
    session: { strategy: 'jwt' },
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: '/auth/login',
        signOut: '/auth/logout',
        error: '/auth/error'
    },
    events: {
        async linkAccount({ user }) {
            await prisma.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            })
        }
    },
    callbacks: {
        async session({ session, token }) {
            // console.log(session, user);
            session.user.id = token?.sub;     // Para incluir ID de usuario
            session.user.role = token?.role
            const user = await getUserById(token.sub)
            session.user.name = user?.name
            session.user.email = user?.email
            session.user.image = user?.image
            session.user.role = user?.role
        
            return session
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const user = await getUserById(token.sub)
            if (!user) return token;

            token.role = user?.role
            return token
        }
    },
}


/*
 callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        phone: token.phone,
        role: token.role
      };
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login'
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60 // 24 horas
  },
  secret: process.env.AUTH_SECRET,

*/


export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({ ...options, ...authConfig })
