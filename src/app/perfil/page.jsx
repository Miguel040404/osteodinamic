// import Header from "@/components/header";
// import Footer from "@/components/footer";
// import PerfilLink from "@/components/perfil-link";
// import { User, BookOpenCheck, Sparkles, LogOut } from "lucide-react";
// import { auth } from "@/auth"; // tu función para obtener el usuario logueado

// // 💡 El componente ahora es async (Server Component)
// async function Perfil() {
//     const session = await auth();

//     // Redirección o mensaje si no hay sesión
//     if (!session || !session.user) {
//         return (
//             <div className="min-h-screen flex flex-col">
//                 <Header />
//                 <main className="flex-1 container mx-auto px-4 py-12">
//                     <p className="text-center text-red-500">No estás autenticado.</p>
//                 </main>
//                 <Footer />
//             </div>
//         );
//     }

//     const user = session.user;

//     return (
//         <div className="min-h-screen flex flex-col">
//             <Header />

//             <main className="flex-1 container mx-auto px-4 py-12 md:py-20">
//                 {/* <h1 className="text-3xl font-bold mb-10">Mi Perfil</h1> */}

//                 {/* Datos del usuario */}
//                 <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6 mb-10">
//                     <div className="flex items-center gap-6">
//                         {user.image && (
//                             <img
//                                 src={user.image}
//                                 alt={user.name}
//                                 className="w-24 h-24 rounded-full object-cover"
//                             />
//                         )}
//                         <div>
//                             <h2 className="text-xl font-semibold">{user.name}</h2>
//                             <p className="text-sm text-gray-600 capitalize">{user.role}</p>
//                         </div>
//                     </div>
//                     <div className="mt-6 space-y-2 text-gray-700">
//                         <p><strong>Email:</strong> {user.email}</p>
//                         {user.phone && <p><strong>Teléfono:</strong> {user.phone}</p>}
//                         {user.address && <p><strong>Dirección:</strong> {user.address}</p>}
//                     </div>
//                 </div>

//                {/* Enlaces del menú */}
//                 <div className="grid gap-4 max-w-md mx-auto">
// {/* 
//                     <PerfilLink
//                         label="Perfil de usuario"
//                         href="/perfil"
//                         icon={<User className="h-5 w-5 text-blue-500" />}
//                     /> */}

//                     <PerfilLink
//                         label="Normas"
//                         href="/normas"
//                         icon={<BookOpenCheck className="h-5 w-5 text-green-500" />}
//                     />
//                     <PerfilLink
//                         label="Novedades"
//                         href="/novedades"
//                         icon={<Sparkles className="h-5 w-5 text-yellow-500" />}
//                     />
//                     <PerfilLink
//                         label="Cerrar sesión"
//                         href="/"
//                         icon={<LogOut className="h-5 w-5 text-red-500" />}
//                         className="hover:bg-red-50 text-red-600"
//                     />
//                 </div>

//             </main>

//             <Footer />
//         </div>
//     );
// }

// export default Perfil;

//solucion vieja

// import LogoutButton from "@/components/LogoutButton";
// import Header from "@/components/header";
// import Footer from "@/components/footer";
// import PerfilLink from "@/components/perfil-link";
// import UserModificar from "@/components/users/modificar";
// import EditarPerfilButton from "@/components/EditarPerfilButton";
// import { User, BookOpenCheck, Sparkles, LogOut } from "lucide-react";
// import { auth } from "@/auth";

// async function Perfil() {
//     const session = await auth();

//     if (!session || !session.user) {
//         return (
//             <div className="min-h-screen flex flex-col">
//                 <Header />
//                 <main className="flex-1 container mx-auto px-4 py-12">
//                     <p className="text-center text-red-500">No estás autenticado.</p>
//                 </main>
//                 <Footer />
//             </div>
//         );
//     }

//     const user = session.user;

//     return (
//         <div className="min-h-screen flex flex-col">
//             <Header />

//             <main className="flex-1 container mx-auto px-4 py-12 md:py-20">
//                 <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6 mb-10 relative">
//                     <div className="flex items-center gap-6">
//                         {user.image ? (
//                             <img
//                                 src={user.image}
//                                 alt={user.name}
//                                 className="w-24 h-24 rounded-full object-cover"
//                             />
//                         ) : (
//                             <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
//                                 <User className="h-10 w-10 text-gray-400" />
//                             </div>
//                         )}
//                         <div>
//                             <h2 className="text-xl font-semibold mt-7">{user.name}</h2>
//                             <p className="text-sm text-gray-600 capitalize">{user.role}</p>
//                         </div>
//                     </div>

//                     <div className="mt-6 space-y-2 text-gray-700">
//                         <p><strong>Email:</strong> {user.email}</p>
//                         {user.phone && <p><strong>Teléfono:</strong> {user.phone}</p>}
//                         {user.address && <p><strong>Dirección:</strong> {user.address}</p>}
//                     </div>

//                     {/* Botón para abrir modal */}

//                     <EditarPerfilButton />

//                 </div>

//                 {/* Modal de edición */}
//                 <dialog id="editarPerfil" className="rounded-lg w-full max-w-xl p-0">
//                     <UserModificar user={user} />
//                 </dialog>

//                 {/* Enlaces del menú */}
//                 <div className="grid gap-4 max-w-md mx-auto">
//                     <PerfilLink
//                         label="Normas"
//                         href="/normas"
//                         icon={<BookOpenCheck className="h-5 w-5 text-green-500" />}
//                     />
//                     <PerfilLink
//                         label="Novedades"
//                         href="/novedades"
//                         icon={<Sparkles className="h-5 w-5 text-yellow-500" />}
//                     />


//                     <LogoutButton />

//                 </div>
//             </main>

//             <Footer />
//         </div>
//     );
// }

// export default Perfil;


import LogoutButton from "@/components/LogoutButton";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PerfilLink from "@/components/perfil-link";
import UserModificar from "@/components/users/modificar";
import EditarPerfilButton from "@/components/EditarPerfilButton";
import { User, BookOpenCheck, Sparkles, LogOut, PencilIcon } from "lucide-react";
import { auth } from "@/auth";
import Modal from "@/components/modal";
import Users from "@/components/users/lista";
import { getUserById } from "@/lib/data";

async function Perfil() {
    const session = await auth();

    if (!session || !session.user) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-12">
                    <p className="text-center text-red-500">No estás autenticado.</p>
                </main>
                <Footer />
            </div>
        );
    }

    const user = session.user;
    const { id, name, email, image, role } = user;
    const usuario = await getUserById(id);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-12 md:py-20 mb-10">
                <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6 mb-10 relative">
                    <div className="flex justify-between">
                        <h1 className="text-3xl font-bold mb-4">Perfil</h1>
                    </div>

                    <div className="grid md:grid-cols-[160px_auto]">
                        <img src={image || '/images/avatar-80.png'} className="size-36" alt="Imagen de usuario" />

                        <div className="flex flex-col gap-1">
                            <div className="flex gap-2 items-center">
                                <p className="font-bold">{name}</p>
                                <EditarPerfilButton />
                            </div>
                            <p>{email}</p>
                            <p>{usuario.address}</p>
                            <p>{usuario.phone}</p>
                            <p>{role}</p>
                        </div>
                    </div>
                </div>

                {user.role === 'ADMIN' && (
                    <>
                        <h1 className="text-xl font-bold mt-15">Lista de usuarios</h1>
                        <Users />
                    </>
                )}

                <div className="grid gap-4 max-w-md mx-auto">
                    <PerfilLink
                        label="Normas"
                        href="/normas"
                        icon={<BookOpenCheck className="h-5 w-5 text-green-500" />}
                    />
                    <PerfilLink
                        label="Novedades"
                        href="/novedades"
                        icon={<Sparkles className="h-5 w-5 text-yellow-500" />}
                    />
                    <LogoutButton />
                </div>

                {/* Modal de edición */}
                <dialog id="editarPerfil" className="rounded-lg w-full max-w-xl p-0">
                    <UserModificar user={usuario} />
                </dialog>
            </main>

            <Footer />
        </div>
    );
}

export default Perfil;
