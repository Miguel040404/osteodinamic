import Link from 'next/link'
import { PlusIcon } from "lucide-react"
import { auth } from '@/auth'   // o el método que uses para obtener la sesión
import { redirect } from 'next/navigation'

export default async function NotificacionesPage() {
  const session = await auth()

  if (!session?.user) {
    // si no hay usuario, redirige al login o home
    redirect('/login')
  }

  // Cargar notificaciones
  const notificaciones = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Notificaciones</h1>

      {/* Solo mostrar icono añadir si es ADMIN */}
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
            <p className="text-sm text-gray-500">
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}