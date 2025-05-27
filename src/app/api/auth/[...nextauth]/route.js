export const runtime = "nodejs";
export { GET, POST } from "@/auth";
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db'; // Asegúrate de tener tu conexión a DB

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        phone: { label: "Teléfono", type: "text" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        try {
          // 1. Validación del formato
          if (!/^\d{9}$/.test(credentials.phone)) {
            throw new Error('InvalidPhoneFormat');
          }

          // 2. Buscar usuario en la base de datos
          const user = await db.user.findUnique({
            where: { phone: credentials.phone }
          });

          if (!user) {
            throw new Error('UserNotFound');
          }

          // 3. Verificar contraseña
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            throw new Error('InvalidPassword');
          }

          // 4. Retornar objeto usuario sin información sensible
          return {
            id: user.id,
            phone: user.phone,
            name: user.name,
            email: user.email
          };

        } catch (error) {
          console.error('Authentication Error:', error);
          throw new Error('CredentialsSignin');
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: '__Secure-next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  trustHost: true,
  pages: {
    signIn: '/login',
    error: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.phone = token.phone;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
// export const authOptions = {
//   providers: [
//     GitHubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//     }),
//     // puedes añadir más aquí
//   ],
//   // más opciones
// }

// const handler = NextAuth(authOptions)
// export { handler as GET, handler as POST }
