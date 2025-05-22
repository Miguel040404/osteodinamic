// import Google from "@auth/core/providers/google"
// import GitHub from '@auth/core/providers/github'
// import Spotify from '@auth/core/providers/spotify'
// import Gitlab from '@auth/core/providers/gitlab'
// import Credentials from "@auth/core/providers/credentials"
// import { getUserByPhone } from "@/lib/data"

// const AuthConfig ={
//     providers: [
//         // Google,
//         // GitHub,
//         // Spotify,
//         // Gitlab,
//         Credentials({
//             async authorize(credentials) {
//                 console.log('AUTHORIZE');
//                 return await getUserByPhone(credentials.phone)
//             },
//         }),
//     ]
// }

// export default AuthConfig;

// prueba importante
// import Credentials from "@auth/core/providers/credentials"
// import { getUserByPhone } from "@/lib/data"

// const authConfig = {
//   providers: [
//     Credentials({
//       async authorize(credentials) {
//         const user = await getUserByPhone(credentials.phone)
//         if (!user) return null;
//         return user;
//       },
//     }),
//   ],
//   secret: process.env.AUTH_SECRET,
// }

// export default authConfig;


// // encriptado
// import Credentials from "@auth/core/providers/credentials";
// import { getUserByPhone } from "@/lib/data";
// import bcrypt from 'bcryptjs';
// import NextAuth from "next-auth";

// const authConfig = {
//   providers: [
//     Credentials({
//       name: 'credentials',
//       credentials: {
//         phone: { label: "Teléfono", type: "text" },
//         password: { label: "Contraseña", type: "password" }
//       },
//       async authorize(credentials) {
//         try {
//           // 1. Validar formato de teléfono
//           if (!credentials.phone?.match(/^\d{9}$/)) {
//             throw new Error('Formato de teléfono inválido');
//           }

//           // 2. Buscar usuario
//           const user = await getUserByPhone(credentials.phone);
//           if (!user) {
//             throw new Error('Usuario no registrado');
//           }

//           // 3. Verificar contraseña
//           const isValidPassword = await bcrypt.compare(
//             credentials.password,
//             user.password
//           );
          
//           if (!isValidPassword) {
//             throw new Error('Contraseña incorrecta');
//           }

//           // 4. Retornar datos de usuario
//           return {
//             id: user.id,
//             name: user.name,
//             phone: user.phone,
//             role: user.role || 'USER'
//           };

//         } catch (error) {
//           console.error('🔥 Error en autenticación:', error.message);
//           throw new Error(error.message);
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.phone = user.phone;
//         token.role = user.role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user = {
//         id: token.id,
//         name: token.name,
//         phone: token.phone,
//         role: token.role
//       };
//       return session;
//     }
//   },
//   pages: {
//     signIn: '/auth/login',
//     error: '/auth/login'
//   },
//   session: {
//     strategy: "jwt",
//     maxAge: 24 * 60 * 60 // 24 horas
//   },
//   secret: process.env.AUTH_SECRET,
// };

// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut
// } = NextAuth(authConfig);

// export default authConfig;

// FUNKA encriptando
import Credentials from "@auth/core/providers/credentials";
import bcrypt from 'bcryptjs';
import NextAuth from "next-auth";

const authConfig = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        phone: { label: "Teléfono", type: "text" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Validar formato de teléfono
          if (!credentials.phone?.match(/^\d{9}$/)) {
            throw new Error('Formato de teléfono inválido');
          }

          // Función única de obtención de usuario
          const user = await prisma.user.findUnique({
            where: { phone: credentials.phone },
            select: {
              id: true,
              name: true,
              phone: true,
              password: true, // ¡Campo esencial!
              role: true
            }
          });

          if (!user) {
            throw new Error('Usuario no registrado');
          }

          // Verificar contraseña
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          
          if (!isValidPassword) {
            throw new Error('Contraseña incorrecta');
          }

          // Retornar datos limpios
          return {
            id: user.id.toString(),
            name: user.name,
            phone: user.phone,
            role: user.role || 'USER'
          };

        } catch (error) {
          console.error('🔥 Error en autenticación:', error.message);
          return null;
        }
      },
    }),
  ],
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
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth(authConfig);

export default authConfig;

// FUNKA
// import Credentials from "@auth/core/providers/credentials";
// import { getUserByPhone } from "@/lib/data";
// import NextAuth from "next-auth";

// const authConfig = {
//   providers: [
//     Credentials({
//       name: 'credentials',
//       credentials: {
//         phone: { label: "Teléfono", type: "text" },
//         password: { label: "Contraseña", type: "password" }
//       },
//       async authorize(credentials) {
//         try {
//           // 1. Validar formato de teléfono
//           if (!credentials.phone?.match(/^\d{9}$/)) {
//             throw new Error('Formato de teléfono inválido');
//           }

//           // 2. Buscar usuario
//           const user = await getUserByPhone(credentials.phone);
//           if (!user) {
//             throw new Error('Usuario no registrado');
//           }

//           // 3. Verificar contraseña (SIN BCRYPT)
//           if (credentials.password !== user.password) {
//             throw new Error('Contraseña incorrecta');
//           }

//           // 4. Retornar datos de usuario
//           return {
//             id: user.id,
//             name: user.name,
//             phone: user.phone,
//             role: user.role || 'USER'
//           };

//         } catch (error) {
//           console.error('Error en autenticación:', error.message);
//           throw new Error(error.message);
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.phone = user.phone;
//         token.role = user.role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user = {
//         id: token.id,
//         name: token.name,
//         phone: token.phone,
//         role: token.role
//       };
//       return session;
//     }
//   },
//   pages: {
//     signIn: '/auth/login',
//     error: '/auth/login'
//   },
//   session: {
//     strategy: "jwt",
//     maxAge: 24 * 60 * 60 // 24 horas
//   },
//   secret: process.env.AUTH_SECRET,
// };

// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut
// } = NextAuth(authConfig);

// export default authConfig;