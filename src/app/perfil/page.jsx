import LogoutButton from "@/components/LogoutButton"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PerfilLink from "@/components/perfil-link"
import EditarPerfilButton from "@/components/EditarPerfilButton"
import { BellRing, BookOpenCheck } from "lucide-react"
import { auth } from "@/auth"
import Users from "@/components/users/lista"
import { getUserById } from "@/lib/data"

export default async function Perfil() {
  const session = await auth()

  if (!session?.user) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* <Header /> */}
        <main className="flex-1 container mx-auto px-4 py-12">
          <p className="text-center text-red-500 text-lg font-semibold">
            No estás autenticado.
          </p>
        </main>
        <Footer />
      </div>
    )
  }

  const user = session.user
  const usuario = await getUserById(user.id)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* <Header /> */}

      <main className="flex-1 container mx-auto px-4 py-10">
        {/* Perfil Card */}
        <section className="max-w-3xl mx-auto bg-white rounded-2xl p-6 sm:p-10 mb-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={user.image || '/images/avatar-80.png'}
              alt="Imagen de usuario"
              className="w-36 h-36 rounded-full object-cover border-4 border-blue-100"
            />

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="!text-gray-700 text-2xl font-bold">{user.name}</h2>
                <EditarPerfilButton user={usuario} />
              </div>
              <p className="text-gray-600">
                Dirección: <span className="font-medium">{usuario.address}</span>
              </p>
              <p className="text-gray-600">
                Teléfono: <span className="font-medium">{usuario.phone}</span>
              </p>
              <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                Rol: {user.role}
              </span>
            </div>
          </div>
        </section>

        {/* Admin: Lista de usuarios */}
        {user.role === 'ADMIN' && (
          <section className="max-w-3xl mx-auto mb-10">
            <details className="bg-white rounded-lg p-4">
              <summary className="!text-gray-600 text-lg font-semibold cursor-pointer">Lista de usuarios</summary>
              <div className="mt-4">
                <Users />
              </div>
            </details>
          </section>
        )}

        {/* Enlaces de acción */}
        <section className="max-w-3xl mx-auto mb-10 grid gap-4 ">
          <PerfilLink
            label="Normas"
            href="/normas"
            icon={<BookOpenCheck className="h-5 w-5 text-green-500" />}
          />
          <PerfilLink
            label="Notificaciones"
            href="/notificaciones"
            icon={<BellRing className="h-5 w-5 text-blue-500" />}
          />
          <LogoutButton />
        </section>
      </main>

      <Footer />
    </div>
  )
}


// import LogoutButton from "@/components/LogoutButton"
// import Header from "@/components/header"
// import Footer from "@/components/footer"
// import PerfilLink from "@/components/perfil-link"
// import EditarPerfilButton from "@/components/EditarPerfilButton"
// import { BellRing, BookOpenCheck, Sparkles } from "lucide-react"
// import { auth } from "@/auth"
// import Users from "@/components/users/lista"
// import { getUserById } from "@/lib/data"

// async function Perfil() {
//   const session = await auth()
  
//   if (!session?.user) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <Header />
//         <main className="flex-1 container mx-auto px-4 py-12">
//           <p className="text-center text-red-500">No estás autenticado.</p>
//         </main>
//         <Footer />
//       </div>
//     )
//   }

//   const user = session.user
//   const usuario = await getUserById(user.id)

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />

//       <main className="flex-1 container mx-auto px-4 py-12 md:py-20 mb-10">
//         <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6 mb-10 relative">
//           <div className="flex justify-between">
//             <h1 className="text-3xl font-bold mb-4">Perfil</h1>
//           </div>

//           <div className="grid md:grid-cols-[160px_auto]">
//             <img 
//               src={user.image || '/images/avatar-80.png'} 
//               // src={user.image || '../../../public/images/avatar-80.png'} 

//               className="size-36" 
//               alt="Imagen de usuario" 
//             />

//             <div className="flex flex-col gap-1">
//               <div className="flex gap-2 items-center">
//                 <p className="font-bold">{user.name}</p>
//                 <EditarPerfilButton user={usuario} />
//               </div>
//               <p>{user.email}</p>
//               <p>{usuario.address}</p>
//               <p>{usuario.phone}</p>
//               <p>{user.role}</p>
//             </div>
//           </div>
//         </div>

//         {user.role === 'ADMIN' && (
//           <>
//             <details className="mt-15">
//               <summary className="text-xl font-bold cursor-pointer">Lista de usuarios</summary>
//               <Users />
//             </details>
//           </>
//         )}

//         <div className="grid gap-4 max-w-md mx-auto">
//           <PerfilLink
//             label="Normas"
//             href="/normas"
//             icon={<BookOpenCheck className="h-5 w-5 text-green-500" />}
//           />
          
//           <PerfilLink
//           label="Notificaciones"
//             href="/notificaciones"
//             icon={<BellRing className="h-5 w-5 text-blue-500" />}
//           />
//           <LogoutButton />
//         </div>
//       </main>

//       <Footer />
//     </div>
//   )
// }

// export default Perfil