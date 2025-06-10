import { diasSemana } from "@/lib/utils";

function getProximaFecha(dia, hora) {
  const hoy = new Date();
  const diaActual = hoy.getDay();
  const diaObjetivo = diasSemana.indexOf(dia) + 1;

  let diferenciaDias = diaObjetivo - diaActual;
  if (diferenciaDias < 0 || (diferenciaDias === 0 && horaPasada(hora))) {
    diferenciaDias += 7;
  }

  const proxima = new Date(hoy);
  proxima.setDate(hoy.getDate() + diferenciaDias);
  return proxima.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  });
}

export const UserReservationItem = ({ reserva, onCancel }) => (
  <div className={`flex flex-col md:flex-row justify-between items-start md:items-center p-5 rounded-xl border ${reserva.horario.tipo === "Entrenamiento" ? "border-[#dbc7b0] bg-[#f4ebe3]" : "border-[#c7b1a1] bg-[#f3e6dc]"}`}>
    <div className="flex-1 mb-4 md:mb-0">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="flex items-center text-[#5b3a29]">
          <span className="font-bold">{reserva.horario.dia}</span>
          <span className="mx-2 text-[#a89989]">•</span>
          <span className="font-medium">{reserva.horario.hora}</span>
          <span className="mx-2 text-[#a89989]">•</span>
          <span className="font-medium">{reserva.horario.sala}</span>
        </div>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${reserva.horario.tipo === "Entrenamiento" ? "bg-[#e9d5c1] text-[#5b3a29]" : "bg-[#dcc1ac] text-[#4d4037]"}`}>
          {reserva.horario.tipo === "Pilates" ? "Pilates terapéutico" : reserva.horario.tipo === "Rehabilitacion_funcional" ? "Rehabilitación funcional" : reserva.horario.tipo === "Entrenamiento_personal" ? "Salud activa personal" : reserva.horario.tipo}
        </div>
      </div>
      <div className="text-sm text-[#7b6e66]">
        Fecha: {getProximaFecha(reserva.horario.dia, reserva.horario.hora)}
      </div>
    </div>
    <form action={onCancel} className="w-full md:w-auto">
      <button type="submit" className="px-4 py-2 text-sm bg-[#fae5e0] text-[#a23b2e] border border-[#e2b4ac] rounded-lg hover:bg-[#f2d4ce] transition cursor-pointer">
        Cancelar reserva
      </button>
    </form>
  </div>
);