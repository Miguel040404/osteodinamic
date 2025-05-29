import { CalendarDays, User, Users } from "lucide-react";
import MenuLink from "./menu-link";

export default function Footer() {
  return (
    <>
      {/* Espacio para que el footer no tape contenido */}
      <div className="h-16 sm:h-20" />

      <footer className="bg-white shadow-inner fixed bottom-0 left-0 w-full z-50">
        <nav className="flex justify-around items-center px-4 py-3 sm:py-4 border-t border-gray-200 bg-gray-100 rounded-t-2xl">
          <MenuLink
            label="Sesiones"
            href="/home"
            icon={<Users className="h-6 w-6 sm:h-7 sm:w-7 text-gray-600" />}
          />
          <MenuLink
            label="Agenda"
            href="/agenda"
            icon={<CalendarDays className="h-6 w-6 sm:h-7 sm:w-7 text-gray-600" />}
          />
          <MenuLink
            label="Perfil"
            href="/perfil"
            icon={<User className="h-6 w-6 sm:h-7 sm:w-7 text-gray-600" />}
          />
        </nav>
      </footer>
    </>
  );
}
