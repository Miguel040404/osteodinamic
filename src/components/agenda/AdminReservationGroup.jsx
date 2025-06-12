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

export const AdminReservationGroup = ({ grupo, onCancel }) => (


  
  <div key={`${grupo.horario.dia}-${grupo.horario.hora}`} className="border border-[#d8c4ae] rounded-xl p-5 bg-[#fffaf5] shadow hover:shadow-md transition">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-1">
        <div className="text-[#4d4037] font-bold text-lg">{grupo.horario.dia}</div>
        <div className="text-[#6c5f57] text-sm">
          <span className="font-semibold">Próxima fecha:</span> {getProximaFecha(grupo.horario.dia, grupo.horario.hora)}
        </div>
        <div className="text-[#6c5f57] text-sm">
          <span className="font-semibold">Hora:</span> {grupo.horario.hora}
        </div>
        <div className="text-[#6c5f57] text-sm">
          <span className="font-semibold">Sala:</span> {grupo.horario.sala}
        </div>
      </div>
      <div className="bg-[#eaddce] text-[#3d332c] rounded-full px-3 py-1 text-sm font-medium border border-[#b8a28a] whitespace-nowrap">
        {grupo.usuarios.length} {grupo.usuarios.length === 1 ? "participante" : "participantes"}
      </div>
    </div>
    <ul className="space-y-2">
      {grupo.usuarios.map((usuario) => (
        <li key={usuario.id} className="flex justify-between items-center bg-[#f3e5d8] rounded-lg px-3 py-2 border border-[#d6c1a8]">
          <span className="font-medium text-[#3d332c]">{usuario.name}</span>
          <form action={onCancel.bind(null, grupo.horario.id, grupo.horario.tipo, usuario.id)}>
            <button type="submit" className="text-rose-600 hover:text-rose-700 text-sm font-semibold cursor-pointer">
              Cancelar
            </button>
          </form>
        </li>
      ))}
    </ul>
  </div>
);