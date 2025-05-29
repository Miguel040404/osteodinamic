import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { eliminarNotificacion } from '@/app/(admin)/notifications/actions'

export default async function NotificacionesPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const notificaciones = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Notificaciones</h1>

      {session.user.role === 'ADMIN' && (
        <Link href="/notifications">
          <PlusIcon className="h-6 w-6 text-blue-500 mb-4 cursor-pointer" />
        </Link>
      )}

      <ul className="space-y-4">
        {notificaciones.map((n) => (
          <li key={n.id} className="border p-4 rounded shadow">
            <h2 className="font-semibold">{n.title}</h2>
            <p>{n.message}</p>
            <p className="text-sm text-gray-500">{new Date(n.createdAt).toLocaleString()}</p>

            {session.user.role === 'ADMIN' && (
              <div className="mt-2 flex gap-4">
                <form action={`/notifications/${n.id}/editar`}>
                  <button type="submit" className="text-blue-500 hover:underline text-sm">Editar</button>
                </form>

                <form action={eliminarNotificacion}>
                  <input type="hidden" name="id" value={n.id} />
                  <button type="submit" className="text-red-500 hover:underline text-sm">Eliminar</button>
                </form>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}