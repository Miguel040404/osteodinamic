import prisma from '@/lib/prisma'
import { editarNotificacion } from '@/app/(admin)/notifications/actions'

export default async function EditarNotificacionPage({ params }) {
  const notificacion = await prisma.notification.findUnique({
    where: { id: params.id },
  })

  // Define una función con id fijo para la acción
  async function action(formData) {
    'use server'
    return editarNotificacion(params.id, formData)
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Editar notificación</h1>
      <form action={action} className="space-y-4">
        <input
          type="text"
          name="title"
          defaultValue={notificacion.title}
          required
          className="w-full border p-2 rounded"
        />
        <textarea
          name="message"
          defaultValue={notificacion.message}
          required
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Guardar cambios
        </button>
      </form>
    </div>
  )
}
