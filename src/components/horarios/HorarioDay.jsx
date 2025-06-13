import { CalendarDays } from "lucide-react";
import { HorarioItem } from "./HorarioItem";


export const HorarioDay = ({ 
  dia, 
  horariosDelDia, 
  userId, 
  esAdmin, 
  tipo,
  reservasUsuario // Nuevo prop
}) => {
  // Función para verificar si el usuario ya tiene reserva en una hora específica
  const tieneReservaEnHora = (hora) => {
    return reservasUsuario.some(reserva => {
      const reservaDia = getDiaNombre(reserva.horario.dia);
      return reservaDia === dia && reserva.horario.hora === hora;
    });
  };

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-md overflow-hidden">
      <div className="p-5 bg-[#b9b59c]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#3d332c] flex items-center gap-3">
              {dia}
            </h2>
          </div>
          <span className="bg-[#e8d7c3] text-[#3d332c] px-3 py-1.5 rounded-full text-sm font-medium shadow-sm border border-[#3d332c]">
            {horariosDelDia.length} horario{horariosDelDia.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {horariosDelDia.length > 0 ? (
          horariosDelDia.map(horario => (
            <HorarioItem
              key={horario.id}
              horario={horario}
              userId={userId}
              esAdmin={esAdmin}
              tipo={tipo}
              bloqueado={tieneReservaEnHora(horario.hora)} // Nuevo prop
              dia={dia} // Pasar el día actual
            />
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 bg-gray-50 border-t border-gray-100">
            <CalendarDays className="w-10 h-10 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">No hay horarios programados para este día</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Función auxiliar para obtener nombre del día (mismo que en ListaHorarios)
const getDiaNombre = (dia) => {
  const dias = {
    'MONDAY': 'Lunes',
    'TUESDAY': 'Martes',
    'WEDNESDAY': 'Miércoles',
    'THURSDAY': 'Jueves',
    'FRIDAY': 'Viernes',
  };
  return dias[dia.toUpperCase()] || dia;
};
