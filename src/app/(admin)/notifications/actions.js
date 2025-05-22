'use server'

import { auth } from '@/auth'

import { redirect } from 'next/navigation'

export async function crearNotificacion(formData) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('No autorizado')
  }

  const title = formData.get('title')
  const message = formData.get('message')

  await prisma.notification.create({
    data: {
      title,
      message,
      createdBy: session.user.id,
    },
  })

  // redirige tras crear
  redirect('/notificaciones')
}