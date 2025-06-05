"use client"

import { marcarNotificacionLeida } from "@/lib/actions";
import { EyeClosed, EyeIcon } from "lucide-react";
import { useActionState } from "react";

function NotificationButton({n, session}) {
    
    const [state, action, pending] = useActionState(marcarNotificacionLeida, {})

    return ( <form action={action} className="w-[190px] h-[40px]">
  <input type="hidden" name="id" value={n.id} />
  <button
    disabled={n.viewed.some(user => user.id === session.user.id)}  // si comentais esta linea podeis cambiar el estado de visto o no visto
    type="submit"
    className={`flex items-center justify-center gap-2 bg-blue-600 border border-gray-300 w-full px-4 py-2 rounded-lg transition-colors duration-300 
                ${n.viewed.some(user => user.id === session.user.id) ? 'bg-gray-300 cursor-not-allowed' : 'hover:bg-blue-500'}`}
  >
    {n.viewed.some(user => user.id === session.user.id) ? (
      <EyeIcon className="w-5 h-5 text-white" />
    ) : (
      <EyeClosed className="w-5 h-5 text-white" />
    )}
    {pending ? (
      <span className="text-white font-semibold">Cargando...</span>
    ) : (
      <span className={`font-bold text-lg ${n.viewed.some(user => user.id === session.user.id) ? 'text-gray-200' : 'text-white'}`}>
        {n.viewed.some(user => user.id === session.user.id) ? 'Leída' : 'No leída'}
      </span>
    )}
  </button>
</form> );
}

export default NotificationButton;