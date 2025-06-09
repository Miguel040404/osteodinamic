'use client'

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <button
      onClick={handleLogout}
      className="cursor-pointer flex items-center justify-between px-4 py-3 rounded-lg shadow-sm border bg-white text-red-600 hover:bg-red-50 transition"
    >
      <div className="flex items-center gap-3">
        <LogOut className="h-5 w-5 text-red-500" />
        <span>Cerrar sesión</span>
      </div>
    </button>
  );
}