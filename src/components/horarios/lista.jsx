// import { getHorariosConReservasPorTipo } from "@/lib/data";

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
//     if (!mapa[horario.dia]) {
//       mapa[horario.dia] = [];
//     }
//     mapa[horario.dia].push(horario);
//   }

//   return diasOrdenados
//     .filter((dia) => mapa[dia])
//     .map((dia) => ({
//       dia,
//       horarios: mapa[dia],
//     }));
// }

// async function ListaHorarios({ tipo }) {
//   const horarios = await getHorariosConReservasPorTipo(tipo);
//   const horariosAgrupados = agruparPorDia(horarios);

//   return (
//     <div className="space-y-4">
//       {horariosAgrupados.map(({ dia, horarios }) => (
//         <div key={dia}>
//           <h2 className="text-lg font-bold">{dia}</h2>
//           <ul className="pl-4 list-disc">
//             {horarios.map((horario) => (
//               <li key={horario.id}>{horario.hora}</li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default ListaHorarios;


// VIEJO

// "use client";

// import { useEffect, useState } from "react";
// import { getHorariosConReservasPorTipo } from "@/lib/data";

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
//     if (!mapa[horario.dia]) {
//       mapa[horario.dia] = [];
//     }
//     mapa[horario.dia].push(horario);
//   }

//   return diasOrdenados
//     .filter((dia) => mapa[dia])
//     .map((dia) => ({
//       dia,
//       horarios: mapa[dia],
//     }));
// }

// function ListaHorarios({ tipo }) {
//   const [horarios, setHorarios] = useState([]);
//   const [usuario, setUsuario] = useState("Nuevo Usuario");

//   useEffect(() => {
//     async function fetchHorarios() {
//       const data = await getHorariosConReservasPorTipo(tipo);
//       setHorarios(data);
//     }
//     fetchHorarios();
//   }, [tipo]);

//   const toggleReserva = (id) => {
//     setHorarios((prev) =>
//       prev.map((h) => {
//         if (h.id === id) {
//           const yaApuntado = h.reservas.includes(usuario);
//           if (yaApuntado) {
//             return { ...h, reservas: h.reservas.filter((u) => u !== usuario) };
//           } else if (h.reservas.length < 6) {
//             return { ...h, reservas: [...h.reservas, usuario] };
//           }
//         }
//         return h;
//       })
//     );
//   };

//   const horariosAgrupados = agruparPorDia(horarios);

//   return (
//     <div className="space-y-4">
//       {horariosAgrupados.map(({ dia, horarios }) => (
//         <div key={dia}>
//           <h2 className="text-lg font-bold">{dia}</h2>
//           <ul className="pl-4 space-y-2">
//             {horarios.map((horario) => (
//               <li key={horario.id} className="border p-2 rounded-md">
//                 <label className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     checked={horario.reservas.includes(usuario)}
//                     disabled={
//                       !horario.reservas.includes(usuario) &&
//                       horario.reservas.length >= 6
//                     }
//                     onChange={() => toggleReserva(horario.id)}
//                   />
//                   <span>
//                     {horario.hora} — {horario.reservas.length}/6 apuntados
//                   </span>
//                 </label>
//                 <ul className="pl-6 text-sm text-gray-600 list-disc">
//                   {horario.reservas.map((nombre, idx) => (
//                     <li key={idx}>{nombre}</li>
//                   ))}
//                 </ul>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default ListaHorarios;


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
