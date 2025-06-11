import { BellIcon } from 'lucide-react';
import { NotificacionItem } from './NotificationItem';


export const NotificacionesList = ({ notificaciones, session }) => (
  <div className="space-y-6">
    {notificaciones.length === 0 ? (
      <div className="text-center py-12 bg-[#e8d7c3] rounded-xl shadow-sm p-8">
        <div className="bg-[#b9b59c] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <BellIcon className="w-8 h-8 text-[#a57551]" />
        </div>
        <h3 className="text-xl font-medium text-[#4d4037]">No hay notificaciones</h3>
        <p className="text-[#4d4037] mt-2">No se han publicado notificaciones aún</p>
      </div>
    ) : (
      notificaciones.map((notificacion) => (
        <NotificacionItem key={notificacion.id} notificacion={notificacion} session={session} />
      ))
    )}
  </div>
);