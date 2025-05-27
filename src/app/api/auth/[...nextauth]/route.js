export const runtime = "nodejs";
export { GET, POST } from "@/auth"
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        phone: { label: "Teléfono", type: "text" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        // Validación del servidor
        if (!/^\d{9}$/.test(credentials.phone)) {
          throw new Error('InvalidPhoneFormat');
        }
        
        // Aquí tu lógica de autenticación real
        const user = await yourAuthenticationMethod(credentials);
        
        if (!user) throw new Error('CredentialsSignin');
        return user;
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
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
  trustHost: true, // Necesario para Vercel
  pages: {
    signIn: '/login',
    error: '/login'
  },
  callbacks: {
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
