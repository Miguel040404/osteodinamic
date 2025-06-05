'use server'

import prisma from "@/lib/prisma"


// ----------------------------  USERS ---------------------------
export async function getUsers() {
    const users = await prisma.user.findMany({
         include: { paidSessions: true }
    });
    return users
}

export async function getUserById(id) {
    const user = await prisma.user.findUnique({
        where: { id }
    });
    return user
}

export async function getNotViewedNotificationsCountByUserId(userId) {
    const count = await prisma.notification.count({
        where: {
            NOT: {
                viewed: {
                    some: {
                        id: userId // Filtra las notificaciones que han sido vistas por este usuario
                    }
                }
            }
        }
    });

    return count;
}

export async function getUserByPhone(phone) {
  try {
    return await prisma.user.findUnique({
      where: { phone: phone.toString() },
      select: {
        id: true,
        name: true,
        phone: true,
        password: true,
        role: true
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function createUser(userData) {
  try {
    return await prisma.user.create({
      data: userData
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

// ---------------------   SESIONES   -----------------------

export async function getAllSessions() {
    return await prisma.session.findMany({
        include: {
            user: true, // Si quieres mostrar información del usuario también
        },
        orderBy: {
            expires: 'desc',
        },
    });
}

// ---------------------   HORARIOS -----------------------

// export async function getHorariosConReservasPorTipo(tipo) {
//     const horarios = await prisma.Horario.findMany({
//         where: { tipo },
//         include: { reservas: true },
//         orderBy: [{ hora: 'asc' }],
//     });

//     console.log('Horarios:', horarios);

//     return horarios;
// }

export async function getHorariosConReservasPorTipo(tipo) {
  return await prisma.horario.findMany({
    where: { tipo },
    include: {
      reservas: {
        include: {
          user: true, 
        },
      },
    },
    orderBy: [
      { dia: 'asc' },
      { hora: 'asc' },
    ],
  });
}

export const hasPaidSession = async (userId, sessionType) => {
  // Los administradores siempre tienen acceso
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });
  
  if (user?.role === 'ADMIN') return true;

  // Verificar sesión pagada para usuarios normales
  const paidSession = await prisma.paidSession.findFirst({
    where: {
      userId: userId,
      sessionType: sessionType,
    },
  });

  return !!paidSession;
};