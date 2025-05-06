import Header from "@/components/header";
import Footer from "@/components/footer";
import MenuLink from "@/components/menu-link";
import { User, BookOpenCheck, Sparkles, LogOut } from "lucide-react";
import { auth } from "@/auth"; // tu función para obtener el usuario logueado

// 💡 El componente ahora es async (Server Component)
async function Perfil() {
    const session = await auth();

    // Redirección o mensaje si no hay sesión
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
                <h1 className="text-3xl font-bold mb-10">Mi Perfil</h1>

                {/* Datos del usuario */}
                <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6 mb-10">
                    <div className="flex items-center gap-6">
                        {user.image && (
                            <img
                                src={user.image}
                                alt={user.name}
                                className="w-24 h-24 rounded-full object-cover"
                            />
                        )}
                        <div>
                            <h2 className="text-xl font-semibold">{user.name}</h2>
                            <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                        </div>
                    </div>
                    <div className="mt-6 space-y-2 text-gray-700">
                        <p><strong>Email:</strong> {user.email}</p>
                        {user.phone && <p><strong>Teléfono:</strong> {user.phone}</p>}
                        {user.address && <p><strong>Dirección:</strong> {user.address}</p>}
                    </div>
                </div>

                {/* Enlaces del menú */}
                <div className="grid gap-4 max-w-md mx-auto">
                    <MenuLink
                        label="Perfil de usuario"
                        href="/perfil"
                        icon={<User className="h-5 w-5 text-blue-500" />}
                    />
                    <MenuLink
                        label="Normas"
                        href="/normas"
                        icon={<BookOpenCheck className="h-5 w-5 text-green-500" />}
                    />
                    <MenuLink
                        label="Novedades"
                        href="/novedades"
                        icon={<Sparkles className="h-5 w-5 text-yellow-500" />}
                    />
                    <MenuLink
                        label="Cerrar sesión"
                        href="/logout"
                        icon={<LogOut className="h-5 w-5 text-red-500" />}
                        className="hover:bg-red-50 text-red-600"
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Perfil;
