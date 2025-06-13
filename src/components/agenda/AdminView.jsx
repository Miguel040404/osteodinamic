import { cancelarReservaAdmin } from "@/lib/actions";
import { AdminReservationGroup } from "./AdminReservationGroup";


const ordenDias = {
  Lunes: 1,
  Martes: 2,
  Miércoles: 3,
  Jueves: 4,
  Viernes: 5,
};

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

export const AdminView = ({ reservas }) => {
  const gruposPorTipo = reservas.reduce((acc, reserva) => {
    const tipo = reserva.horario.tipo;
    if (!acc[tipo]) acc[tipo] = [];
    acc[tipo].push(reserva);
    return acc;
  }, {});

  const tiposOrdenados = Object.keys(gruposPorTipo).sort();

  return (
    <div className="bg-[#f9eee1] rounded-xl shadow-lg p-6">
      {tiposOrdenados.map((tipo) => {
        const horariosAgrupados = gruposPorTipo[tipo].reduce((acc, reserva) => {
          const key = `${reserva.horario.dia}-${reserva.horario.hora}`;
          if (!acc[key]) {
            acc[key] = { horario: reserva.horario, usuarios: [] };
          }
          acc[key].usuarios.push(reserva.user);
          return acc;
        }, {});

        const horariosOrdenados = Object.values(horariosAgrupados).sort((a, b) => {
          const diaA = ordenDias[a.horario.dia];
          const diaB = ordenDias[b.horario.dia];
          if (diaA !== diaB) return diaA - diaB;
          return a.horario.hora.localeCompare(b.horario.hora);
        });

        return (
          <div key={tipo} className="mb-10">
            <h2 className="text-2xl font-bold text-[#4d4037] mb-6 pb-2 border-b border-[#d8c4ae]">
              {tipo === 'Pilates'
                ? 'Pilates terapéutico'
                : tipo === 'Rehabilitacion_funcional'
                ? 'Rehabilitación funcional'
                : tipo === 'Entrenamiento_personal'
                ? 'Salud activa personal'
                : tipo}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {horariosOrdenados.map((grupo) => (
                <AdminReservationGroup
                  key={`${grupo.horario.dia}-${grupo.horario.hora}`}
                  grupo={grupo}
                  onCancel={cancelarReservaAdmin}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};