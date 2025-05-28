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

        // // Ejemplo con Prisma (debes implementar tu propia lógica)
        // const user = await prisma.user.findUnique({
        //   where: { phone: credentials.phone }
        // });

        // // Verificar usuario y contraseña (usa bcrypt.compare en producción)
        // if (!user || user.password !== credentials.password) {
        //   throw new Error('CredentialsSignin');
        // }

        // return { id: user.id, phone: user.phone };
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
  // cookies: {
  //   sessionToken: {
  //     name: `__Secure-next-auth.session-token`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       secure: true, // Siempre true en producción
  //       domain: process.env.NODE_ENV === 'production' 
  //         ? '.tu-dominio.vercel.app' 
  //         : undefined
  //     }
  //   }
  // },
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
