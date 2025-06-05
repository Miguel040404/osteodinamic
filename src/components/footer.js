import { CalendarDays, User, Users } from "lucide-react";
import MenuLink from "./menu-link";

export default function Footer() {
  return (
    <>
      {/* Espacio para que el footer no tape contenido */}
      <div className="h-16 sm:h-20" />

      <footer className=" shadow-inner fixed bottom-0 left-0 w-full z-50">
        <nav className="flex justify-around items-center px-3 py-2 sm:py-3 border-t bg-[#e8d7c3]">
          <MenuLink
            label="Sesiones"
            href="/home"
            icon={<Users className="h-5 w-5 sm:h-6 sm:w-6 text-[#c5b6a5]" />}
          />
          <MenuLink
            label="Agenda"
            href="/agenda"
            icon={<CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 text-[#c5b6a5]" />}
          />
          <MenuLink
            label="Perfil"
            href="/perfil"
            icon={<User className="h-5 w-5 sm:h-6 sm:w-6 text-[#c5b6a5]" />}
          />
        </nav>
      </footer>
    </>
  );
}
