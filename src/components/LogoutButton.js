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
      className="flex items-center justify-between px-4 py-3 rounded-lg shadow-sm border bg-white text-red-600 hover:bg-red-50 transition"
    >
      <div className="flex items-center gap-3">
        <LogOut className="h-5 w-5 text-red-500" />
        <span>Cerrar sesión</span>
      </div>
    </button>
  );
}


// 'use client'

// import { signOut } from "next-auth/react";
// import { LogOut } from "lucide-react";

// export default function LogoutButton() {
//   const handleLogout = () => {
//     signOut({ callbackUrl: "/auth/login" }); // Te redirige al login después de cerrar sesión
//   };

//   return (
//     <button
//       onClick={handleLogout}
//       className="flex gap-2 items-center p-4 rounded-full text-lg font-semibold text-red-600 hover:bg-red-50 transition duration-300"
//     >
//       <LogOut className="h-5 w-5 text-red-500" />
//       <span>Cerrar sesión</span>
//     </button>
//   );
// }
