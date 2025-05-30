'use server'

import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

// Crear notificación

let lastExecution = 0

export async function crearNotificacion(formData) {
  const now = Date.now()
  if (now - lastExecution < 2000) return // Bloquear por 2 segundos
  lastExecution = now

  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') throw new Error('No autorizado')

    const title = formData.get('title')
    const message = formData.get('message')

    await prisma.notification.create({
      data: {
        title,
        message,
        createdBy: session.user.id,
      },
    })
  } finally {
    // No necesitamos resetear ya que usamos timestamp
  }
  
  redirect('/notificaciones')
}

// Editar notificación
export async function editarNotificacion(id, formData) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') throw new Error('No autorizado')

  const title = formData.get('title')
  const message = formData.get('message')

  await prisma.notification.update({
    where: { id },
    data: { title, message },
  })

  redirect('/notificaciones')
}

// Eliminar notificación
export async function eliminarNotificacion(formData) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') throw new Error('No autorizado')

  const id = formData.get('id')
  await prisma.notification.delete({ where: { id } })

  redirect('/notificaciones')
}


// 'use server'

// import { auth } from '@/auth'
// import prisma from '@/lib/prisma'

// import { redirect } from 'next/navigation'

// export async function crearNotificacion(formData) {
//   const session = await auth()

//   if (!session?.user || session.user.role !== 'ADMIN') {
//     throw new Error('No autorizado')
//   }

//   const title = formData.get('title')
//   const message = formData.get('message')

//   await prisma.notification.create({
//     data: {
//       title,
//       message,
//       createdBy: session.user.id,
//     },
//   })

//   // redirige tras crear
//   redirect('/notificaciones')
// }