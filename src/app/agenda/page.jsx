import Footer from "@/components/footer";
import {
  getReservasDelUsuario,
  getTodasReservas,
  cancelarReserva,
  cancelarReservaAdmin,
} from "@/lib/actions";
import { auth } from "@/auth";
import { Suspense } from "react";

const ordenDias = {
  Lunes: 1,
  Martes: 2,
  Miércoles: 3,
  Jueves: 4,
  Viernes: 5,
};

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

function getProximaFecha(dia, hora) {
  const hoy = new Date();
  const diaActual = hoy.getDay(); // 0 (Domingo) - 6 (Sábado)
  const diaObjetivo = diasSemana.indexOf(dia) + 1; // Lunes = 1

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

function horaPasada(hora) {
  const [h, m] = hora.split(":").map(Number);
  const ahora = new Date();
  return ahora.getHours() > h || (ahora.getHours() === h && ahora.getMinutes() > m);
}

const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-80">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-500 mx-auto"></div>
      <p className="mt-4 text-lg text-slate-600 flex justify-center">
        Cargando agenda
        <span className="flex">
          <span className="animate-bounce">.</span>
          <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
        </span>
      </p>
    </div>
  </div>
);

export default function AgendaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-sky-100 text-slate-800">
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <Suspense fallback={<LoadingSpinner />}>
          <AgendaContentWrapper />
        </Suspense>
      </main>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}

async function AgendaContentWrapper() {
  const session = await auth();
  const userId = session?.user?.id;
  const esAdmin = session?.user?.role === "ADMIN";

  const reservas = esAdmin ? await getTodasReservas() : await getReservasDelUsuario(userId);

  return <AgendaContent reservas={reservas} esAdmin={esAdmin} />;
}

function AgendaContent({ reservas, esAdmin }) {
  return (
    <>
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-sky-700 mb-2">
          {esAdmin ? "Panel de Administración" : "Mi Agenda"}
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          {esAdmin
            ? "Administra todas las reservas y horarios del sistema"
            : "Revisa y gestiona tus próximas sesiones programadas"}
        </p>
      </div>

      {esAdmin ? <AdminView reservas={reservas} /> : <UserView reservas={reservas} />}
    </>
  );
}

function AdminView({ reservas }) {
  const gruposPorTipo = reservas.reduce((acc, reserva) => {
    const tipo = reserva.horario.tipo;
    if (!acc[tipo]) acc[tipo] = [];
    acc[tipo].push(reserva);
    return acc;
  }, {});

  const tiposOrdenados = Object.keys(gruposPorTipo).sort();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
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
            <h2 className="text-2xl font-bold text-sky-700 mb-6 pb-2 border-b">{tipo}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {horariosOrdenados.map((grupo) => (
                <div
                  key={`${grupo.horario.dia}-${grupo.horario.hora}`}
                  className="border rounded-xl p-5 bg-white shadow hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg text-sky-800">
                          {grupo.horario.dia} ({getProximaFecha(grupo.horario.dia, grupo.horario.hora)})
                        </span>
                        <span className="text-slate-400">|</span>
                        <span className="font-semibold text-slate-700">{grupo.horario.hora}</span>
                      </div>
                    </div>
                    <div className="bg-sky-100 text-sky-800 rounded-full px-3 py-1 text-sm font-medium border">
                      {grupo.usuarios.length} {grupo.usuarios.length === 1 ? "participante" : "participantes"}
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {grupo.usuarios.map((usuario) => (
                      <li key={usuario.id} className="flex justify-between items-center bg-slate-50 rounded-lg px-3 py-2 border">
                        <span className="font-medium">{usuario.name}</span>
                        <form action={cancelarReservaAdmin.bind(null, grupo.horario.id, grupo.horario.tipo, usuario.id)}>
                          <button type="submit" className="text-rose-500 hover:text-rose-700 text-sm">Cancelar</button>
                        </form>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function UserView({ reservas }) {
  const reservasOrdenadas = [...reservas].sort((a, b) => {
    const diaA = ordenDias[a.horario.dia] || 99;
    const diaB = ordenDias[b.horario.dia] || 99;
    if (diaA !== diaB) return diaA - diaB;
    return a.horario.hora.localeCompare(b.horario.hora);
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-sky-800">Mis reservas</h2>
        <div className="text-sm font-medium px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
          {reservas.length} {reservas.length === 1 ? "reserva" : "reservas"}
        </div>
      </div>
      {reservas.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <h3 className="text-xl font-medium">No tienes sesiones reservadas</h3>
          <p>Reserva tu primera sesión para empezar tu entrenamiento.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservasOrdenadas.map((reserva) => (
            <div
              key={reserva.id}
              className={`flex flex-col md:flex-row justify-between items-start md:items-center p-5 rounded-xl border ${
                reserva.horario.tipo === "Entrenamiento"
                  ? "border-sky-200 bg-sky-50"
                  : "border-indigo-200 bg-indigo-50"
              }`}
            >
              <div className="flex-1 mb-4 md:mb-0">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="flex items-center">
                    <span className="font-bold">{reserva.horario.dia}</span>
                    <span className="mx-2 text-slate-400">•</span>
                    <span className="font-medium">{reserva.horario.hora}</span>
                  </div>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      reserva.horario.tipo === "Entrenamiento"
                        ? "bg-sky-100 text-sky-800"
                        : "bg-indigo-100 text-indigo-800"
                    }`}
                  >
                    {reserva.horario.tipo}
                  </div>
                </div>
                <div className="text-sm text-slate-600">
                  Fecha: {getProximaFecha(reserva.horario.dia, reserva.horario.hora)}
                </div>
              </div>
              <form
                action={cancelarReserva.bind(null, reserva.horarioId, reserva.horario.tipo)}
                className="w-full md:w-auto"
              >
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-rose-50 text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-100 transition"
                >
                  Cancelar reserva
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// import Footer from "@/components/footer";
// import { getReservasDelUsuario, getTodasReservas, cancelarReserva, cancelarReservaAdmin } from "@/lib/actions";
// import { auth } from "@/auth";
// import { Suspense } from "react";

// const ordenDias = {
//   "Lunes": 1,
//   "Martes": 2,
//   "Miércoles": 3,
//   "Jueves": 4,
//   "Viernes": 5,
// };

// const LoadingSpinner = () => (
//   <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-80">
//     <div className="text-center">
//       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-500 mx-auto"></div>
//       <p className="mt-4 text-lg text-slate-600 flex justify-center">
//         Cargando agenda
//         <span className="flex">
//           <span className="animate-bounce">.</span>
//           <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
//           <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
//         </span>
//       </p>
//     </div>
//   </div>
// );

// export default async function AgendaPage() {
//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-sky-100 text-slate-800">
//       <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-6xl">
//         <Suspense fallback={<LoadingSpinner />}>
//           <AgendaContent />
//         </Suspense>
//       </main>

//       <div className="mt-16">
//         <Footer />
//       </div>
//     </div>
//   );
// }

// async function AgendaContent() {
//   const session = await auth();
//   const userId = session?.user?.id;
//   const esAdmin = session?.user?.role === "ADMIN";

//   const reservas = esAdmin
//     ? await getTodasReservas()
//     : await getReservasDelUsuario(userId);

//   return (
//     <>
//       <div className="mb-10 text-center">
//         <h1 className="text-3xl md:text-4xl font-bold text-sky-700 mb-2">
//           {esAdmin ? "Panel de Administración" : "Mi Agenda"}
//         </h1>
//         <p className="text-slate-600 max-w-2xl mx-auto">
//           {esAdmin 
//             ? "Administra todas las reservas y horarios del sistema" 
//             : "Revisa y gestiona tus próximas sesiones programadas"}
//         </p>
//       </div>

//       {esAdmin ? <AdminView reservas={reservas} /> : <UserView reservas={reservas} />}
//     </>
//   );
// }

// function AdminView({ reservas }) {
//   const gruposPorTipo = reservas.reduce((acc, reserva) => {
//     const tipo = reserva.horario.tipo;
//     if (!acc[tipo]) acc[tipo] = [];
//     acc[tipo].push(reserva);
//     return acc;
//   }, {});

//   const tiposOrdenados = Object.keys(gruposPorTipo).sort();

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <div>
//           <h2 className="text-xl font-bold text-sky-800">Todas las reservas</h2>
//           <p className="text-slate-600 mt-1">Agrupadas por tipo de actividad</p>
//         </div>
//       </div>

//       {tiposOrdenados.length === 0 ? (
//         <div className="text-center py-12 text-slate-500">
//           <h3 className="text-xl font-medium">No hay reservas programadas</h3>
//           <p>Todavía no se han realizado reservas para ningún horario.</p>
//         </div>
//       ) : (
//         <div className="space-y-10">
//           {tiposOrdenados.map((tipo) => {
//             const horariosAgrupados = gruposPorTipo[tipo].reduce((acc, reserva) => {
//               const key = `${reserva.horario.dia}-${reserva.horario.hora}`;
//               if (!acc[key]) {
//                 acc[key] = { horario: reserva.horario, usuarios: [] };
//               }
//               acc[key].usuarios.push(reserva.user);
//               return acc;
//             }, {});

//             const horariosOrdenados = Object.values(horariosAgrupados).sort((a, b) => {
//               const diaA = ordenDias[a.horario.dia];
//               const diaB = ordenDias[b.horario.dia];
//               if (diaA !== diaB) return diaA - diaB;
//               return a.horario.hora.localeCompare(b.horario.hora);
//             });

//             return (
//               <div key={tipo} className="border-b pb-8 last:border-b-0">
//                 <h2 className="text-2xl font-bold text-sky-700 mb-6 pb-2 border-b">
//                   {tipo}
//                 </h2>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//                   {horariosOrdenados.map((grupo) => (
//                     <div
//                       key={`${grupo.horario.dia}-${grupo.horario.hora}`}
//                       className={`border rounded-xl p-5 transition-all duration-300 hover:shadow-md ${
//                         tipo === "Entrenamiento"
//                           ? "border-sky-200 bg-white"
//                           : "border-indigo-200 bg-white"
//                       }`}
//                     >
//                       <div className="flex justify-between items-start mb-4">
//                         <div>
//                           <div className="flex items-center gap-2 mb-1">
//                             <span className="font-bold text-lg text-sky-800">{grupo.horario.dia}</span>
//                             <span className="text-slate-400">|</span>
//                             <span className="font-semibold text-slate-700">{grupo.horario.hora}</span>
//                           </div>
//                         </div>
//                         <div className="bg-sky-100 text-sky-800 rounded-full px-3 py-1 text-sm font-medium border">
//                           {grupo.usuarios.length} {grupo.usuarios.length === 1 ? "participante" : "participantes"}
//                         </div>
//                       </div>

//                       <div className="mt-4">
//                         <h3 className="text-sm font-medium text-slate-700 mb-2">Asistentes:</h3>
//                         <ul className="space-y-2">
//                           {grupo.usuarios.map((usuario) => (
//                             <li
//                               key={usuario.id}
//                               className="flex justify-between items-center bg-slate-50 rounded-lg px-3 py-2 border"
//                             >
//                               <span className="font-medium">{usuario.name}</span>
//                               <form action={cancelarReservaAdmin.bind(null, grupo.horario.id, grupo.horario.tipo, usuario.id)}>
//                               <button type="submit" className="text-rose-500 hover:text-rose-700 text-sm flex items-center" >
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                   <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
//                                 </svg>
//                               </button>
//                               </form>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// function UserView({ reservas }) {
//   const reservasOrdenadas = [...reservas].sort((a, b) => {
//     const diaA = ordenDias[a.horario.dia] || 99;
//     const diaB = ordenDias[b.horario.dia] || 99;
//     if (diaA !== diaB) return diaA - diaB;
//     return a.horario.hora.localeCompare(b.horario.hora);
//   });

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-bold text-sky-800">Mis reservas</h2>
//         <div className="text-sm font-medium px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
//           {reservas.length} {reservas.length === 1 ? "reserva" : "reservas"}
//         </div>
//       </div>

//       {reservas.length === 0 ? (
//         <div className="text-center py-12 text-slate-500">
//           <h3 className="text-xl font-medium">No tienes sesiones reservadas</h3>
//           <p>Reserva tu primera sesión para empezar tu entrenamiento.</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {reservasOrdenadas.map((reserva) => (
//             <div
//               key={reserva.id}
//               className={`flex flex-col md:flex-row justify-between items-start md:items-center p-5 rounded-xl border ${
//                 reserva.horario.tipo === "Entrenamiento"
//                   ? "border-sky-200 bg-sky-50"
//                   : "border-indigo-200 bg-indigo-50"
//               }`}
//             >
//               <div className="flex-1 mb-4 md:mb-0">
//                 <div className="flex flex-wrap items-center gap-3 mb-3">
//                   <div className="flex items-center">
//                     <span className="font-bold">{reserva.horario.dia}</span>
//                     <span className="mx-2 text-slate-400">•</span>
//                     <span className="font-medium">{reserva.horario.hora}</span>
//                   </div>
//                   <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
//                     reserva.horario.tipo === "Entrenamiento"
//                       ? "bg-sky-100 text-sky-800"
//                       : "bg-indigo-100 text-indigo-800"
//                   }`}>
//                     {reserva.horario.tipo}
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-4 text-sm text-slate-700">
//                   <span>{reserva.horario._count?.reservas || 0} participantes</span>
//                 </div>
//               </div>

//               <form
//                 action={cancelarReserva.bind(null, reserva.horarioId, reserva.horario.tipo)}
//                 className="w-full md:w-auto"
//               >
//                 <button
//                   type="submit"
//                   className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 text-sm bg-rose-50 text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-100 transition duration-300"
//                 >
//                   Cancelar reserva
//                 </button>
//               </form>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

