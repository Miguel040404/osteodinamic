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

import LogoutButton from "@/components/LogoutButton";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PerfilLink from "@/components/perfil-link";
import UserModificar from "@/components/users/modificar";
import EditarPerfilButton from "@/components/EditarPerfilButton";
import { User, BookOpenCheck, Sparkles, LogOut } from "lucide-react";
import { auth } from "@/auth";

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

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6 mb-10 relative">
                    <div className="flex items-center gap-6">
                        {user.image ? (
                            <img
                                src={user.image}
                                alt={user.name}
                                className="w-24 h-24 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="h-10 w-10 text-gray-400" />
                            </div>
                        )}
                        <div>
                            <h2 className="text-xl font-semibold mt-7">{user.name}</h2>
                            <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-2 text-gray-700">
                        <p><strong>Email:</strong> {user.email}</p>
                        {user.phone && <p><strong>Teléfono:</strong> {user.phone}</p>}
                        {user.address && <p><strong>Dirección:</strong> {user.address}</p>}
                    </div>

                    {/* Botón para abrir modal */}

                    <EditarPerfilButton />

                </div>

                {/* Modal de edición */}
                <dialog id="editarPerfil" className="rounded-lg w-full max-w-xl p-0">
                    <UserModificar user={user} />
                </dialog>

                {/* Enlaces del menú */}
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
                    {/* <PerfilLink
                        label="Cerrar sesión"
                        icon={<LogOut className="h-5 w-5 text-red-500" />}
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => {
                            localStorage.removeItem("token"); // o sessionStorage/cookies según el caso
                            window.location.href = "/auth/login";
                        }}
                    /> */}

                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Perfil;

