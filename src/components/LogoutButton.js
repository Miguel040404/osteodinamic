'use client'

import { LogOut } from "lucide-react";

export default function LogoutButton() {
    const handleLogout = () => {
        localStorage.removeItem("token"); 
        window.location.href = "/auth/login";
    };

    return (
        <button
            onClick={handleLogout}
            className="flex gap-2 items-center p-4 rounded-full text-lg font-semibold text-red-600 hover:bg-red-50 transition duration-300"
        >
            <LogOut className="h-5 w-5 text-red-500" />
            <span>Cerrar sesión</span>
        </button>
    );
}
