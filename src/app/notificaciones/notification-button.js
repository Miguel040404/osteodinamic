"use client"

import { marcarNotificacionLeida } from "@/lib/actions";
import { EyeIcon, EyeOff } from "lucide-react";
import { useActionState } from "react";

function NotificationButton({ n, session }) {
  const [state, action, pending] = useActionState(marcarNotificacionLeida, {});

  const isRead = n.viewed.some(user => user.id === session.user.id);

  return (
    <form action={action} className="w-[190px] h-[40px]">
      <input type="hidden" name="id" value={n.id} />
      <button
        disabled={isRead}
        type="submit"
        className={`flex items-center justify-center gap-2 border w-full px-4 py-2 rounded-lg transition-colors duration-300
          ${isRead
            ? 'bg-[#b9b59c] border-[#b9b59c] cursor-not-allowed'
            : 'bg-[#a57551] border-[#a57551] hover:bg-[#8d6245]'}`}
      >
        {isRead ? (
          <EyeIcon className="w-5 h-5 text-white" />
        ) : (
          <EyeOff className="w-5 h-5 text-white" />
        )}
        {pending ? (
          <span className="text-white font-semibold">Cargando...</span>
        ) : (
          <span className={`font-bold text-lg ${isRead ? 'text-[#f9faf5]' : 'text-white'}`}>
            {isRead ? 'Leída' : 'No leída'}
          </span>
        )}
      </button>
    </form>
  );
}

export default NotificationButton;