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

// Clases contadas
export async function getClassCounts() {
  try {
    // Obtener todos los horarios con el conteo de sus reservas
    const horariosConReservas = await prisma.horario.findMany({
      include: {
        _count: {
          select: { reservas: true }
        }
      }
    });

    const horariosDisponibles = horariosConReservas.filter(
      horario => horario._count.reservas < 6
    );

    // Recuento de horarios disponibles por tipo
    const counts = horariosDisponibles.reduce((acc, horario) => {
      const tipo = horario.tipo.toLowerCase();
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});

    // Asegurar que todos los tipos tengan un valor
    return {
      pilates: counts.pilates || 0,
      rehabilitacion_funcional: counts.rehabilitacion_funcional || 0,
      entrenamiento_personal: counts.entrenamiento_personal || 0
    };
  } catch (error) {
    console.error("Error fetching class counts:", error);
    return {
      pilates: 0,
      rehabilitacion_funcional: 0,
      entrenamiento_personal: 0
    };
  }
}

// ---------------------   HORARIOS -----------------------
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