'use server'

import prisma from "@/lib/prisma"


// ----------------------------  USERS ---------------------------


export async function getUsers() {
    const users = await prisma.user.findMany({
        // include: { posts: true }
    });
    return users
}


export async function getUserById(id) {
    const user = await prisma.user.findUnique({
        where: { id }
    });
    return user
}

export async function getUserByPhone(phone) {
    const user = await prisma.user.findUnique({
        where: { phone }
    });
    return user
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

export async function getHorariosConReservasPorTipo(tipo) {
    const horarios = await prisma.Horario.findMany({
        where: { tipo },
        include: { reservas: true },
        orderBy: [{ hora: 'asc' }],
    });

    console.log('Horarios:', horarios);

    return horarios;
}