export const runtime = "nodejs";
export { GET, POST } from "@/auth"
import prisma from "@/lib/prisma";
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
        // Validar formato de teléfono
        if (!/^\d{9}$/.test(credentials.phone)) {
          throw new Error('InvalidPhoneFormat');
        }
        
        try {
          const user = await prisma.user.findUnique({
            where: { phone: credentials.phone }
          });

          if (!user) throw new Error('CredentialsSignin');

          // ¡Comparación segura de contraseñas!
          const passwordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordValid) throw new Error('CredentialsSignin');

          return { id: user.id, phone: user.phone };
        } catch (error) {
          console.error("Error en autorización:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        // Elimina la configuración de dominio
        domain: process.env.NODE_ENV === 'production'
          ? 'osteoosteodinamic.vercel.app' // ¡NUEVO DOMINIO!
          : undefined
      }
    }
  },
  trustHost: true, // Obligatorio para Vercel
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