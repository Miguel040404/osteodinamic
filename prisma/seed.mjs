import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const usuarios = [
  {
    name: 'Pepe Viyuelas',
    email: 'pepe@pepe.com',
    address: 'C/ Nueva, 99',
    image: 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/128/28.jpg',
    phone: '123456789',
    role: 'USER',
  },
  {
    name: 'Ana Alferez',
    email: 'ana@ana.com',
    address: 'C/ Ancha, 100',
    image: 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/128/28.jpg',
    phone: '111111111',
    role: 'USER',
  },
  {
    name: 'Jose López',
    email: 'jose@jose.com',
    address: 'Avda. Constitución, 1',
    image: 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/128/14.jpg',
    phone: '444444444',
    role: 'ADMIN',
  },
]

const horarios = [
  {
    dia: 'Lunes',
    hora: '09:00',
    tipo: 'Pilates',
  },
  {
    dia: 'Martes',
    hora: '11:00',
    tipo: 'Rehabilitacion_funcional',
  },
  {
    dia: 'Miércoles',
    hora: '18:00',
    tipo: 'Entrenamiento_personal',
  },
  {
    dia: 'Jueves',
    hora: '10:00',
    tipo: 'Pilates',
  },
  {
    dia: 'Viernes',
    hora: '17:00',
    tipo: 'Entrenamiento_personal',
  },
]

const resetDatabase = async () => {
  await prisma.reserva.deleteMany()
  await prisma.horario.deleteMany()
  await prisma.user.deleteMany()
}

const load = async () => {
  try {
    await resetDatabase()

    await prisma.user.createMany({ data: usuarios })
    console.log('Usuarios insertados')

    for (const horario of horarios) {
      await prisma.horario.create({ data: horario })
    }
    console.log('Horarios insertados')
  } catch (error) {
    console.error('Error al insertar datos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

load()
