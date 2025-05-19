import { CalendarDays, User, Users } from "lucide-react";
import MenuLink from "./menu-link";

export default function Footer() {
    return (
        <footer className="bg-white shadow-md z-10 fixed bottom-0 left-0 w-full">
            <nav className="flex justify-around items-center bg-gray-100 px-2 py-2 sm:py-3 border-t">

                <MenuLink label="Sesiones" href="/home" icon={<Users className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />} />

                <MenuLink label="Agenda" href="/agenda" icon={<CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />} />

                <MenuLink label="Perfil" href="/perfil" icon={<User className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />} />
            </nav>
        </footer>
    )
}