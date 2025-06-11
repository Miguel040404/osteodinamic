import Link from 'next/link';
import { PlusIcon, BellIcon } from 'lucide-react';


export const NotificacionesHeader = ({ notificaciones, session }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-[#4d4037] flex items-center gap-3">
        <BellIcon className="w-8 h-8 text-[#a57551]" />
        Notificaciones
      </h1>
      <p className="text-[#4d4037] mt-1">
        {notificaciones.length} notificación{notificaciones.length !== 1 ? 'es' : ''}
      </p>
    </div>

    {session.user.role === 'ADMIN' && (
      <Link href="/crearNotificacionesAdmin">
        <button className="cursor-pointer flex items-center gap-2 bg-[#a57551] hover:bg-[#8f5e40] text-white px-4 py-2.5 rounded-lg transition-colors shadow-sm hover:shadow-md">
          <PlusIcon className="w-5 h-5" />
          <span>Nueva Notificación</span>
        </button>
      </Link>
    )}
  </div>
);