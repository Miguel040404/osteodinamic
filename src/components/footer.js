import { CalendarDays, User, Users } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white shadow-md z-10 fixed bottom-0 left-0 w-full">
            <nav className="flex justify-around items-center bg-gray-100 px-2 py-2 sm:py-3 border-t">

                <div className="flex flex-col items-center text-xs sm:text-sm md:text-base px-3 py-2 sm:px-4 sm:py-2 rounded-2xl transition-all duration-200 bg-blue-100 shadow-md scale-105 text-blue-700">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-blue-600" />
                    <span>Sesiones</span>
                </div>

                <div className="flex flex-col items-center text-xs sm:text-sm md:text-base px-3 py-2 sm:px-4 sm:py-2 rounded-2xl hover:bg-gray-300 transition-all duration-150">
                    <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-gray-600" />
                    <span className="text-gray-800">Agenda</span>
                </div>

                <div className="flex flex-col items-center text-xs sm:text-sm md:text-base px-3 py-2 sm:px-4 sm:py-2 rounded-2xl hover:bg-gray-300 transition-all duration-150">
                    <User className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-gray-600" />
                    <span className="text-gray-800">Perfil</span>
                </div>
            </nav>
        </footer>
    )
}