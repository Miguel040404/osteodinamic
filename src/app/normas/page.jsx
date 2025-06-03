import Link from 'next/link'
import { PlusIcon, PencilIcon, TrashIcon, BellIcon, ClockIcon, UserIcon } from 'lucide-react'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

import Footer from '@/components/footer'
import { redirect } from 'next/navigation'
import { eliminarNorma } from '@/lib/actions'

export default async function NormasPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const normas = await prisma.norma.findMany({
    orderBy: { creadaEn: 'desc' },
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50">
      <div className="max-w-4xl mx-auto py-10 px-4">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
              <BellIcon className="w-8 h-8 text-indigo-600" />
              Normas
            </h1>
            <p className="text-gray-500 mt-1">
              {normas.length} norma{normas.length !== 1 ? 's' : ''} 
            </p>
          </div>
          
          {session.user.role === 'ADMIN' && (
            <Link href="/normasAdmin">
              <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-colors shadow-sm hover:shadow-md">
                <PlusIcon className="w-5 h-5" />
                <span>Nueva Norma</span>
              </button>
            </Link>
          )}
        </div>

        {/* Lista de notificaciones */}
        <div className="space-y-6">
          {normas.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm p-8">
              <div className="bg-indigo-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BellIcon className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-700">No hay normas</h3>
              <p className="text-gray-500 mt-2">No se han publicado normas aún</p>
            </div>
          ) : (
            normas.map((n) => (
              <div 
                key={n.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                          <BellIcon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">{n.titulo}</h2>
                      </div>
                      
                      <p className="text-gray-600 mt-3">{n.contenido}</p>
                      
                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <ClockIcon className="w-4 h-4" />
                          <span>{new Date(n.creadaEn).toLocaleString()}</span>
                        </div>
                        
                       
                      </div>
                    </div>
                    
                    {session.user.role === 'ADMIN' && (
                      <div className="flex flex-col gap-3 min-w-[120px]">
                        <Link href={`/normasAdmin/${n.id}/editar`}>
                          <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 w-full px-3 py-2 rounded-lg transition-colors">
                            <PencilIcon className="w-4 h-4" />
                            <span>Editar</span>
                          </button>
                        </Link>
                        
                        <form action={eliminarNorma} className="w-full">
                          <input type="hidden" name="id" value={n.id} />
                          <button
                            type="submit"
                            className="flex items-center gap-2 bg-white border border-gray-300 text-red-600 hover:bg-red-50 w-full px-3 py-2 rounded-lg transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                            <span>Eliminar</span>
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-12">
          <Footer />
        </div>
      </div>
    </div>
  )
}

// import Link from 'next/link'
// import { PlusIcon } from 'lucide-react'
// import { auth } from '@/auth'
// import prisma from '@/lib/prisma'
// import { eliminarNotificacion } from '@/app/(admin)/notifications/actions'
// import Footer from '@/components/footer'

// export default async function NotificacionesPage() {
//   const session = await auth()
//   if (!session?.user) redirect('/login')

//   const notificaciones = await prisma.notification.findMany({
//     orderBy: { createdAt: 'desc' },
//   })

//   return (
//     <div className="max-w-2xl mx-auto py-8">
//       <h1 className="text-2xl font-bold mb-6">Notificaciones</h1>

//       {session.user.role === 'ADMIN' && (
//         <Link href="/notifications">
//           <PlusIcon className="h-6 w-6 text-blue-500 mb-4 cursor-pointer" />
//         </Link>
//       )}

//       <ul className="space-y-4">
//         {notificaciones.map((n) => (
//           <li key={n.id} className="border p-4 rounded shadow">
//             <h2 className="font-semibold">{n.title}</h2>
//             <p>{n.message}</p>
//             <p className="text-sm text-gray-500">{new Date(n.createdAt).toLocaleString()}</p>

//             {session.user.role === 'ADMIN' && (
//               <div className="mt-2 flex gap-4">
//                 <form action={`/notifications/${n.id}/editar`}>
//                   <button type="submit" className="text-blue-500 hover:underline text-sm">Editar</button>
//                 </form>

//                 <form action={eliminarNotificacion}>
//                   <input type="hidden" name="id" value={n.id} />
//                   <button type="submit" className="text-red-500 hover:underline text-sm">Eliminar</button>
//                 </form>
//               </div>
//             )}
//           </li>
//         ))}
//       </ul>
//        <Footer />
//     </div>
   
//   )
// }