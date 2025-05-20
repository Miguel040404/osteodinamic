
// import { apuntarseAHorario, cancelarReserva } from "@/lib/actions";
// import { getHorariosConReservasPorTipo } from "@/lib/data";
// import { auth } from "@/auth";

// const diasOrdenados = [
//   "Lunes",
//   "Martes",
//   "Miércoles",
//   "Jueves",
//   "Viernes",
//   "Sábado",
//   "Domingo",
// ];

// function agruparPorDia(horarios) {
//   const mapa = {};
//   for (const horario of horarios) {
//     if (!mapa[horario.dia]) mapa[horario.dia] = [];
//     mapa[horario.dia].push(horario);
//   }
//   return diasOrdenados
//     .filter((dia) => mapa[dia])
//     .map((dia) => ({ dia, horarios: mapa[dia] }));
// }

// export default async function ListaHorarios({ tipo }) {
//   const session = await auth();
//   const userId = session?.user?.id;

//   const horarios = await getHorariosConReservasPorTipo(tipo);
//   const agrupados = agruparPorDia(horarios);

//   return (
//     <div className="space-y-6">
//       {agrupados.map(({ dia, horarios }) => (
//         <div key={dia}>
//           <h2 className="font-bold text-lg">{dia}</h2>
//           <ul className="space-y-4">
//             {horarios.map((horario) => {
//               const yaApuntado = horario.reservas.some((r) => r.userId === userId);
//               const completo = horario.reservas.length >= 6;

//               return (
//                 <li key={horario.id} className="border p-4 rounded">
//                   <form action={(yaApuntado ? cancelarReserva : apuntarseAHorario).bind(null, horario.id, tipo)}>
//                     <div className="flex items-center gap-4">
//                       <span className="text-md font-medium">{horario.hora}</span>
//                       <span>{horario.reservas.length}/6 apuntados</span>
//                       <button
//                         type="submit"
//                         className={`px-3 py-1 text-white rounded ${yaApuntado
//                             ? "bg-red-500 hover:bg-red-600"
//                             : completo
//                               ? "bg-gray-400 cursor-not-allowed"
//                               : "bg-blue-500 hover:bg-blue-600"
//                           }`}
//                         disabled={!yaApuntado && completo}
//                       >
//                         {yaApuntado ? "Cancelar" : "Apuntarme"}
//                       </button>
//                     </div>
//                     <ul className="ml-6 mt-2 list-disc text-sm text-gray-600">
//                       {horario.reservas.map((r, idx) => (
//                         <li key={idx}>{r.nombre}</li>
//                       ))}
//                     </ul>
//                   </form>
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// }


import { apuntarseAHorario, cancelarReserva, cancelarReservaAdmin } from "@/lib/actions";
import { auth } from "@/auth";
import { getHorariosConReservasPorTipo } from "@/lib/data";

export default async function ListaHorarios({ tipo }) {
  const session = await auth();
  const userId = session?.user?.id;
  const esAdmin = session?.user?.role === "ADMIN";
  const horarios = await getHorariosConReservasPorTipo(tipo);

  return (
    <div className="space-y-6">
      <ul className="space-y-4">
        {horarios.map((horario) => {
          const yaApuntado = horario.reservas.some((r) => r.userId === userId);
          const completo = horario.reservas.length >= 6;

          return (
            <li key={horario.id} className="border p-4 rounded">
              <form action={(yaApuntado ? cancelarReserva : apuntarseAHorario).bind(null, horario.id, tipo)}>
                <div className="flex items-center gap-4">
                  <span className="text-md font-medium">
                    {horario.dia} - {horario.hora}
                  </span>
                  {/* Opcional: Ocultar contador para usuarios normales */}
                  {esAdmin && <span>{horario.reservas.length}/6 apuntados</span>}
                  <button
                    type="submit"
                    className={`px-3 py-1 text-white rounded ${yaApuntado
                      ? "bg-red-500 hover:bg-red-600"
                      : completo
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    disabled={!yaApuntado && completo}
                  >
                    {yaApuntado ? "Cancelar" : "Apuntarme"}
                  </button>
                </div>
              </form>

              {/* Bloque oculto para usuarios normales */}
              {esAdmin && (
                <ul className="ml-6 mt-2 list-disc text-sm text-gray-600">
                  {horario.reservas.map((r, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      {r.user?.name || "Nombre no disponible"}
                      <form action={cancelarReservaAdmin.bind(null, horario.id, tipo, r.userId)}>
                        <button
                          type="submit"
                          className="ml-2 text-sm text-red-500 hover:underline"
                        >
                          Quitar
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
