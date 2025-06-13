import { ordenDias } from "@/lib/utils";
import { UserReservationItem } from "./UserReservationItem";
import { cancelarReservaForm } from "@/lib/actions";


export const UserView = ({ reservas }) => {
  const reservasOrdenadas = [...reservas].sort((a, b) => {
    const diaA = ordenDias[a.horario.dia] || 99;
    const diaB = ordenDias[b.horario.dia] || 99;
    if (diaA !== diaB) return diaA - diaB;
    return a.horario.hora.localeCompare(b.horario.hora);
  });

  return (
    <div className="bg-[#fdf8f4] rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#4d4037]">Mis reservas</h2>
        <div className="text-sm font-medium px-3 py-1 bg-[#f4e3c9] text-[#5b3a29] rounded-full border border-[#dfc7aa]">
          {reservas.length} {reservas.length === 1 ? "reserva" : "reservas"}
        </div>
      </div>
      {reservas.length === 0 ? (
        <div className="text-center py-12 text-[#7b6e66]">
          <h3 className="text-xl font-medium">No tienes sesiones reservadas</h3>
          <p>Reserva tu primera sesión para empezar tu entrenamiento.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservasOrdenadas.map((reserva) => (
            <UserReservationItem key={reserva.id} reserva={reserva} onCancel={cancelarReservaForm} />
          ))}
        </div>
      )}
    </div>
  );
};