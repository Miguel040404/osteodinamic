import { getHorariosConReservasPorTipo } from "@/lib/data";

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
    if (!mapa[horario.dia]) {
      mapa[horario.dia] = [];
    }
    mapa[horario.dia].push(horario);
  }

  return diasOrdenados
    .filter((dia) => mapa[dia])
    .map((dia) => ({
      dia,
      horarios: mapa[dia],
    }));
}

async function ListaHorarios({ tipo }) {
  const horarios = await getHorariosConReservasPorTipo(tipo);
  const horariosAgrupados = agruparPorDia(horarios);

  return (
    <div className="space-y-4">
      {horariosAgrupados.map(({ dia, horarios }) => (
        <div key={dia}>
          <h2 className="text-lg font-bold">{dia}</h2>
          <ul className="pl-4 list-disc">
            {horarios.map((horario) => (
              <li key={horario.id}>{horario.hora}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ListaHorarios;