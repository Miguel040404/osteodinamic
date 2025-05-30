import Header from "@/components/header";
import Footer from "@/components/footer";
import { getReservasDelUsuario, getTodasReservas, cancelarReserva, cancelarReservaAdmin } from "@/lib/actions";
import { auth } from "@/auth";

const ordenDias = {
  "Lunes": 1,
  "Martes": 2,
  "Miércoles": 3,
  "Jueves": 4,
  "Viernes": 5,
  // "Sábado": 6,
  // "Domingo": 7
};

export default async function AgendaPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const esAdmin = session?.user?.role === "ADMIN";

  // Obtener datos según rol
  let reservas = esAdmin
    ? await getTodasReservas()
    : await getReservasDelUsuario(userId);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {esAdmin ? "Panel de Administración" : "Mi Agenda"}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {esAdmin 
              ? "Administra todas las reservas y horarios del sistema" 
              : "Revisa y gestiona tus próximas sesiones programadas"}
          </p>
        </div>

        {esAdmin ? (
          // Vista de administrador mejorada
          <AdminView reservas={reservas} />
        ) : (
          // Vista de usuario mejorada
          <UserView reservas={reservas} />
        )}
      </main>
      
      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}

// Componente para vista de administrador
function AdminView({ reservas }) {
  // Ordenar y agrupar reservas
  reservas = reservas.sort((a, b) =>
    ordenDias[a.horario.dia] - ordenDias[b.horario.dia]
  );

  // Agrupar por horario
  const horariosAgrupados = reservas.reduce((acc, reserva) => {
    const key = `${reserva.horario.dia}-${reserva.horario.hora}`;
    if (!acc[key]) {
      acc[key] = {
        horario: reserva.horario,
        usuarios: []
      };
    }
    acc[key].usuarios.push(reserva.user);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Todas las reservas</h2>
          <p className="text-gray-600 mt-1">Agrupadas por horario</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Entrenamiento</span>
            <div className="w-3 h-3 rounded-full bg-purple-500 ml-2"></div>
            <span>Clase grupal</span>
          </div>
        </div>
      </div>

      {Object.values(horariosAgrupados).length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No hay reservas programadas</h3>
          <p className="text-gray-600">Todavía no se han realizado reservas para ningún horario.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.values(horariosAgrupados).map((grupo) => (
            <div 
              key={`${grupo.horario.dia}-${grupo.horario.hora}`} 
              className={`border rounded-xl p-5 transition-all duration-300 hover:shadow-md ${
                grupo.horario.tipo === "Entrenamiento" 
                  ? "border-blue-200 bg-blue-50" 
                  : "border-purple-200 bg-purple-50"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg">{grupo.horario.dia}</span>
                    <span className="text-gray-500">|</span>
                    <span className="font-semibold text-gray-700">{grupo.horario.hora}</span>
                  </div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    grupo.horario.tipo === "Entrenamiento" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-purple-100 text-purple-800"
                  }`}>
                    {grupo.horario.tipo}
                  </div>
                </div>
                <div className="bg-white rounded-full px-3 py-1 text-sm font-medium border">
                  {grupo.usuarios.length} {grupo.usuarios.length === 1 ? "participante" : "participantes"}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Asistentes:</h3>
                <ul className="space-y-2">
                  {grupo.usuarios.map((usuario) => (
                    <li 
                      key={usuario.id} 
                      className="flex justify-between items-center bg-white rounded-lg px-3 py-2 border"
                    >
                      <div className="flex items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 flex items-center justify-center mr-3">
                          <span className="text-xs font-bold text-gray-500">
                            {usuario.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium">{usuario.name}</span>
                      </div>
                      <form action={cancelarReservaAdmin.bind(null, grupo.horario.id, grupo.horario.tipo, usuario.id)}>
                        <button
                          type="submit"
                          className="text-red-500 hover:text-red-700 text-sm flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Componente para vista de usuario
function UserView({ reservas }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Mis reservas</h2>
          <p className="text-gray-600 mt-1">Próximas sesiones programadas</p>
        </div>
        <div className="text-sm font-medium px-3 py-1 bg-green-100 text-green-800 rounded-full">
          {reservas.length} {reservas.length === 1 ? "reserva" : "reservas"}
        </div>
      </div>

      {reservas.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No tienes sesiones reservadas</h3>
          <p className="text-gray-600 mb-6">Reserva tu primera sesión para empezar tu entrenamiento.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300">
            Buscar horarios disponibles
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reservas.map((reserva) => (
            <div 
              key={reserva.id}
              className={`flex flex-col md:flex-row justify-between items-start md:items-center p-5 rounded-xl border ${
                reserva.horario.tipo === "Entrenamiento" 
                  ? "border-blue-200 bg-blue-50" 
                  : "border-purple-200 bg-purple-50"
              }`}
            >
              <div className="flex-1 mb-4 md:mb-0">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold">{reserva.horario.dia}</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="font-medium">{reserva.horario.hora}</span>
                  </div>
                  
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    reserva.horario.tipo === "Entrenamiento" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-purple-100 text-purple-800"
                  }`}>
                    {reserva.horario.tipo}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700">
                      {new Date(reserva.fechaReal).toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-gray-700">
                      {reserva.horario._count?.reservas || 0} participantes
                    </span>
                  </div>
                </div>
              </div>
              
              <form
                action={cancelarReserva.bind(null, reserva.horarioId, reserva.horario.tipo)}
                className="w-full md:w-auto"
              >
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 text-sm bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
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

// import Header from "@/components/header";
// import Footer from "@/components/footer";
// import { getReservasDelUsuario, getTodasReservas, cancelarReserva, cancelarReservaAdmin } from "@/lib/actions";
// import { auth } from "@/auth";

// const ordenDias = {
//   "Lunes": 1,
//   "Martes": 2,
//   "Miércoles": 3,
//   "Jueves": 4,
//   "Viernes": 5,
//   "Sábado": 6,
//   "Domingo": 7
// };

// export default async function AgendaPage() {
//   const session = await auth();
//   const userId = session?.user?.id;
//   const esAdmin = session?.user?.role === "ADMIN";

//   // Obtener datos según rol
//   let reservas = esAdmin
//     ? await getTodasReservas()
//     : await getReservasDelUsuario(userId);

//   // Ordenar y agrupar reservas para admins
//   if (esAdmin) {
//     reservas = reservas.sort((a, b) =>
//       ordenDias[a.horario.dia] - ordenDias[b.horario.dia]
//     );

//     // Agrupar por horario
//     const horariosAgrupados = reservas.reduce((acc, reserva) => {
//       const key = `${reserva.horario.dia}-${reserva.horario.hora}`;
//       if (!acc[key]) {
//         acc[key] = {
//           horario: reserva.horario,
//           usuarios: []
//         };
//       }
//       acc[key].usuarios.push(reserva.user);
//       return acc;
//     }, {});

//     return (
//       <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
//         {/* <Header /> */}

//         <main className="flex-1 container mx-auto px-4 py-12 md:py-20">
//           <h1 className="text-2xl font-bold mb-4">Todas las reservas</h1>

//           <div className="space-y-6">
//             {Object.values(horariosAgrupados).map((grupo) => (
//               <div key={`${grupo.horario.dia}-${grupo.horario.hora}`} className="border p-4 rounded-lg bg-white">
//                 <div className="flex items-center justify-between mb-3">
//                   <div>
//                     <h2 className="font-semibold">
//                       {grupo.horario.dia} - {grupo.horario.hora}
//                     </h2>
//                     <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
//                       {grupo.horario.tipo}
//                     </span>
//                   </div>
//                   <span className="text-sm text-gray-500">
//                     Participantes: {grupo.usuarios.length} 
//                   </span>
//                 </div>

//                 <ul className="space-y-2">
//                   {grupo.usuarios.map((usuario) => (
//                     <li key={usuario.id} className="flex justify-between items-center px-2 py-1">
//                       <span>{usuario.name}</span>
//                       <form action={cancelarReservaAdmin.bind(null, grupo.horario.id, grupo.horario.tipo, usuario.id)}>
//                         <button
//                           type="submit"
//                           className="text-red-500 hover:text-red-700 text-sm"
//                         >
//                           Eliminar
//                         </button>
//                       </form>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </main>
//           <Footer />
//       </div>
//     );
//   }

//   // Vista normal para usuarios
//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
//       {/* <Header /> */}

//       <main className="flex-1 container mx-auto px-4 py-12 md:py-24">
//         <h1 className="text-2xl font-bold mb-4">Mi Agenda</h1>

//         {reservas.length === 0 ? (
//           <p className="text-gray-500">No tienes sesiones reservadas.</p>
//         ) : (
//           <ul className="space-y-3">
//             {reservas.map((reserva) => (
//               <li
//   key={reserva.id}
//   className="flex items-center justify-between px-4 py-3 rounded-lg border bg-white"
// >
//   <div className="flex-1">
//     <div className="flex items-center gap-2 mb-1">
//       <span className="font-medium">{reserva.horario.dia}</span> - 
//       <span>{reserva.horario.hora}</span>
//       <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
//         {reserva.horario.tipo}
//       </span>
//     </div>
//     <div className="flex items-center gap-4">
//       <span className="text-sm text-gray-500">
//         {new Date(reserva.fechaReal).toLocaleDateString()}
//       </span>
//       <span className="text-sm text-gray-600">
//         Participantes: {reserva.horario._count?.reservas || 0} 
//       </span>
//     </div>
//   </div>
  
//   {/* Botón de cancelación */}
//   <form
//     action={cancelarReserva.bind(null, reserva.horarioId, reserva.horario.tipo)}
//     className="ml-4"
//   >
//     <button
//       type="submit"
//       className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
//     >
//       Cancelar
//     </button>
//   </form>
// </li>
//             ))}
//           </ul>
//         )}
//       </main>

//      <div className="mt-12">
//           <Footer />
//         </div>
//     </div>
//   );
// }