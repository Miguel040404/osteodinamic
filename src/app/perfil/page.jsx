import Header from "@/components/header";
import Footer from "@/components/footer";
import MenuLink from "@/components/menu-link";


import { User, BookOpenCheck, Sparkles, LogOut } from "lucide-react";

function Perfil() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-12 md:py-20">
                <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>

                <div className="grid gap-4 max-w-md mx-auto">
                    <MenuLink
                        label="Perfil de usuario"
                        href="/perfil"
                        icon={<User className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-blue-500" />}
                    />

                    <MenuLink
                        label="Normas"
                        href="/normas"
                        icon={<BookOpenCheck className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-green-500" />}
                    />

                    <MenuLink
                        label="Novedades"
                        href="/novedades"
                        icon={<Sparkles className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-yellow-500" />}
                    />

                    <MenuLink
                        label="Cerrar sesión"
                        href="/logout"
                        icon={<LogOut className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-red-500" />}
                        className="hover:bg-red-50 text-red-600"
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Perfil;
