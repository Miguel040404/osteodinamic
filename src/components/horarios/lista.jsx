import { apuntarseAHorario } from "@/lib/actions";
import { getHorariosConReservasPorTipo } from "@/lib/data";
import { auth } from "@/auth";

const diasOrdenados = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

function agruparPorDia(horarios) {
  const mapa = {};
  for (const horario of horarios) {
    if (!mapa[horario.dia]) mapa[horario.dia] = [];
    mapa[horario.dia].push(horario);
  }
  return diasOrdenados
    .filter((dia) => mapa[dia])
    .map((dia) => ({ dia, horarios: mapa[dia] }));
}

export default async function ListaHorarios({ tipo }) {
  const session = await auth();
  const userId = session?.user?.id;

  const horarios = await getHorariosConReservasPorTipo(tipo);
  const agrupados = agruparPorDia(horarios);

  return (
    <div className="space-y-6">
      {agrupados.map(({ dia, horarios }) => (
        <div key={dia}>
          <h2 className="font-bold text-lg">{dia}</h2>
          <ul className="space-y-4">
            {horarios.map((horario) => {
              const yaApuntado = horario.reservas.some((r) => r.userId === userId);
              const completo = horario.reservas.length >= 6;

              return (
                <li key={horario.id} className="border p-4 rounded">
                  <form action={apuntarseAHorario.bind(null, horario.id)}>
                    <div className="flex items-center gap-4">
                      <span className="text-md font-medium">{horario.hora}</span>
                      <span>{horario.reservas.length}/6 apuntados</span>
                      <button
                        type="submit"
                        disabled={completo || yaApuntado}
                        className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-400"
                      >
                        {yaApuntado ? "Apuntado" : "Apuntarme"}
                      </button>
                    </div>
                    <ul className="ml-6 mt-2 list-disc text-sm text-gray-600">
                      {horario.reservas.map((r, idx) => (
                        <li key={idx}>{r.nombre}</li>
                      ))}
                    </ul>
                  </form>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}