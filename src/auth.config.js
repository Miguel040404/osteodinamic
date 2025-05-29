import Credentials from "@auth/core/providers/credentials";
import bcrypt from 'bcryptjs';
import NextAuth from "next-auth";
import prisma from "./lib/prisma";

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
 
};

export default authConfig;