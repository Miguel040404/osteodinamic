import Link from 'next/link'
import { PlusIcon, PencilIcon, TrashIcon, BellIcon, ClockIcon, UserIcon } from 'lucide-react'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { eliminarNotificacion } from '@/app/(admin)/notifications/actions'
import Footer from '@/components/footer'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

// Componente para el spinner de carga
const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-80">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-lg text-gray-600 flex justify-center">
        Cargando notificaciones
        <span className="flex">
          <span className="animate-bounce">.</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
        </span>
      </p>
    </div>
  </div>
);

// Componente para el contenido de notificaciones
async function NotificacionesContent() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const notificaciones = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50">
      <div className="max-w-4xl mx-auto py-10 px-4">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
              <BellIcon className="w-8 h-8 text-indigo-600" />
              Notificaciones
            </h1>
            <p className="text-gray-500 mt-1">
              {notificaciones.length} notificación{notificaciones.length !== 1 ? 'es' : ''} 
            </p>
          </div>
          
          {session.user.role === 'ADMIN' && (
            <Link href="/notifications">
              <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-colors shadow-sm hover:shadow-md">
                <PlusIcon className="w-5 h-5" />
                <span>Nueva Notificación</span>
              </button>
            </Link>
          )}
        </div>

        {/* Lista de notificaciones */}
        <div className="space-y-6">
          {notificaciones.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm p-8">
              <div className="bg-indigo-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BellIcon className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-700">No hay notificaciones</h3>
              <p className="text-gray-500 mt-2">No se han publicado notificaciones aún</p>
            </div>
          ) : (
            notificaciones.map((n) => (
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
                        <h2 className="text-xl font-semibold text-gray-800">{n.title}</h2>
                      </div>
                      
                      <p className="text-gray-600 mt-3">{n.message}</p>
                      
                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <ClockIcon className="w-4 h-4" />
                          <span>{new Date(n.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {session.user.role === 'ADMIN' && (
                      <div className="flex flex-col gap-3 min-w-[120px]">
                        <Link href={`/notifications/${n.id}/editar`}>
                          <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 w-full px-3 py-2 rounded-lg transition-colors">
                            <PencilIcon className="w-4 h-4" />
                            <span>Editar</span>
                          </button>
                        </Link>
                        
                        <form action={eliminarNotificacion} className="w-full">
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

export default function NotificacionesPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <NotificacionesContent />
    </Suspense>
  )
}

// sin carga
// import Link from 'next/link'
// import { PlusIcon, PencilIcon, TrashIcon, BellIcon, ClockIcon, UserIcon } from 'lucide-react'
// import { auth } from '@/auth'
// import prisma from '@/lib/prisma'
// import { eliminarNotificacion } from '@/app/(admin)/notifications/actions'
// import Footer from '@/components/footer'
// import { redirect } from 'next/navigation'

// export default async function NotificacionesPage() {
//   const session = await auth()
//   if (!session?.user) redirect('/login')

//   const notificaciones = await prisma.notification.findMany({
//     orderBy: { createdAt: 'desc' },
//   })

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50">
//       <div className="max-w-4xl mx-auto py-10 px-4">
//         {/* Encabezado */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
//               <BellIcon className="w-8 h-8 text-indigo-600" />
//               Notificaciones
//             </h1>
//             <p className="text-gray-500 mt-1">
//               {notificaciones.length} notificación{notificaciones.length !== 1 ? 'es' : ''} 
//             </p>
//           </div>
          
//           {session.user.role === 'ADMIN' && (
//             <Link href="/notifications">
//               <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-colors shadow-sm hover:shadow-md">
//                 <PlusIcon className="w-5 h-5" />
//                 <span>Nueva Notificación</span>
//               </button>
//             </Link>
//           )}
//         </div>

//         {/* Lista de notificaciones */}
//         <div className="space-y-6">
//           {notificaciones.length === 0 ? (
//             <div className="text-center py-12 bg-white rounded-xl shadow-sm p-8">
//               <div className="bg-indigo-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
//                 <BellIcon className="w-8 h-8 text-indigo-600" />
//               </div>
//               <h3 className="text-xl font-medium text-gray-700">No hay notificaciones</h3>
//               <p className="text-gray-500 mt-2">No se han publicado notificaciones aún</p>
//             </div>
//           ) : (
//             notificaciones.map((n) => (
//               <div 
//                 key={n.id}
//                 className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
//               >
//                 <div className="p-6">
//                   <div className="flex flex-col md:flex-row justify-between gap-4">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-3 mb-2">
//                         <div className="bg-indigo-100 p-2 rounded-lg">
//                           <BellIcon className="w-5 h-5 text-indigo-600" />
//                         </div>
//                         <h2 className="text-xl font-semibold text-gray-800">{n.title}</h2>
//                       </div>
                      
//                       <p className="text-gray-600 mt-3">{n.message}</p>
                      
//                       <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
//                         <div className="flex items-center gap-2">
//                           <ClockIcon className="w-4 h-4" />
//                           <span>{new Date(n.createdAt).toLocaleString()}</span>
//                         </div>
                        
                       
//                       </div>
//                     </div>
                    
//                     {session.user.role === 'ADMIN' && (
//                       <div className="flex flex-col gap-3 min-w-[120px]">
//                         <Link href={`/notifications/${n.id}/editar`}>
//                           <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 w-full px-3 py-2 rounded-lg transition-colors">
//                             <PencilIcon className="w-4 h-4" />
//                             <span>Editar</span>
//                           </button>
//                         </Link>
                        
//                         <form action={eliminarNotificacion} className="w-full">
//                           <input type="hidden" name="id" value={n.id} />
//                           <button
//                             type="submit"
//                             className="flex items-center gap-2 bg-white border border-gray-300 text-red-600 hover:bg-red-50 w-full px-3 py-2 rounded-lg transition-colors"
//                           >
//                             <TrashIcon className="w-4 h-4" />
//                             <span>Eliminar</span>
//                           </button>
//                         </form>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         <div className="mt-12">
//           <Footer />
//         </div>
//       </div>
//     </div>
//   )
// }
