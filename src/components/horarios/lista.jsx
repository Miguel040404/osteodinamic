// import { CrearHorarioForm } from "@/components/CrearHorarioForm";
// import { apuntarseAHorario, cancelarReserva, cancelarReservaAdmin, editarHorario, eliminarHorario } from "@/lib/actions";
// import { auth } from "@/auth";
// import { getHorariosConReservasPorTipo } from "@/lib/data";

// export default async function ListaHorarios({ tipo }) {
//   const session = await auth();
//   const userId = session?.user?.id;
//   const esAdmin = session?.user?.role === "ADMIN";
//   const horarios = await getHorariosConReservasPorTipo(tipo);

//   return (
//     <div className="space-y-8 max-w-4xl mx-auto">
//       {esAdmin && <CrearHorarioForm tipo={tipo} />}

//       <ul className="space-y-6">
//         {horarios.map((horario) => {
//           const yaApuntado = horario.reservas.some((r) => r.userId === userId);
//           const completo = horario.reservas.length >= 6;
//           const plazasRestantes = 6 - horario.reservas.length;

//           return (
//             <li key={horario.id} className="border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
//               <div className="p-6 space-y-6">
//                 {/* Sección principal */}
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                   <div className="space-y-2">
//                     <h3 className="text-xl font-semibold text-gray-800">
//                       {horario.dia} - {horario.hora}
//                     </h3>
//                     <p className={`text-sm ${
//                       plazasRestantes > 2 ? 'text-green-600' : 'text-amber-600'
//                     }`}>
//                       {plazasRestantes} plazas disponibles
//                     </p>
//                   </div>

//                   <form
//                     action={(yaApuntado ? cancelarReserva : apuntarseAHorario).bind(null, horario.id, tipo)}
//                     className="w-full md:w-auto"
//                   >
//                     <button
//                       type="submit"
//                       className={`w-full md:w-32 px-4 py-2 rounded-lg font-medium transition-colors ${
//                         yaApuntado
//                           ? 'bg-red-100 text-red-700 hover:bg-red-200'
//                           : completo
//                           ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
//                           : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
//                       }`}
//                       disabled={!yaApuntado && completo}
//                     >
//                       {yaApuntado ? 'Cancelar' : 'Apuntarme'}
//                     </button>
//                   </form>
//                 </div>

//                 {/* Controles de administración */}
//                 {esAdmin && (
//                   <div className="space-y-6 border-t pt-6">
//                     <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
//                       {/* Eliminar */}
//                       <div className="flex items-center gap-4 w-full md:w-auto">
//                         <form action={eliminarHorario.bind(null, horario.id)} className="w-full">
//                           <button
//                             type="submit"
//                             className="w-full px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium"
//                           >
//                             Eliminar horario
//                           </button>
//                         </form>
//                       </div>

//                       {/* Editar */}
//                       <form 
//                         action={async (formData) => {
//                           "use server";
//                           const dia = formData.get("dia");
//                           const hora = formData.get("hora");
//                           await editarHorario(horario.id, dia, hora);
//                         }}
//                         className="w-full space-y-4"
//                       >
//                         <div className="flex flex-col md:flex-row gap-3 w-full">
//                           <select 
//                             name="dia" 
//                             defaultValue={horario.dia}
//                             className="flex-1 px-3 py-2 border rounded-lg bg-white"
//                           >
//                             {['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].map(d => (
//                               <option key={d} value={d}>{d}</option>
//                             ))}
//                           </select>

//                           <select 
//                             name="hora" 
//                             defaultValue={horario.hora}
//                             className="flex-1 px-3 py-2 border rounded-lg bg-white"
//                           >
//                             {["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"].map(h => (
//                               <option key={h} value={h}>{h}</option>
//                             ))}
//                           </select>

//                           <button
//                             type="submit"
//                             className="w-full md:w-auto px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
//                           >
//                             Actualizar
//                           </button>
//                         </div>
//                       </form>
//                     </div>

//                     {/* Lista de reservas */}
//                     <div className="bg-gray-50 rounded-lg p-4">
//                       <h4 className="text-sm font-medium text-gray-600 mb-3">Reservas activas:</h4>
//                       <ul className="space-y-2">
//                         {horario.reservas.map((r, idx) => (
//                           <li key={idx} className="flex justify-between items-center bg-white px-4 py-2 rounded-md">
//                             <span className="text-gray-700">{r.user?.name || "Usuario anónimo"}</span>
//                             <form action={cancelarReservaAdmin.bind(null, horario.id, tipo, r.userId)}>
//                               <button
//                                 type="submit"
//                                 className="text-red-500 hover:text-red-700 text-sm font-medium"
//                               >
//                                 Eliminar
//                               </button>
//                             </form>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// }


// // viejo
// import { CrearHorarioModal, EditarHorarioModal, EliminarHorarioModal } from "@/components/HorarioModals";
// import { apuntarseAHorario, cancelarReserva, cancelarReservaAdmin } from "@/lib/actions";
// import { auth } from "@/auth";
// import { getHorariosConReservasPorTipo } from "@/lib/data";

// export default async function ListaHorarios({ tipo }) {
//   const session = await auth();
//   const userId = session?.user?.id;
//   const esAdmin = session?.user?.role === "ADMIN";
//   const horarios = await getHorariosConReservasPorTipo(tipo);

//   return (
//     <div className="space-y-8 max-w-4xl mx-auto">
//       {esAdmin && <CrearHorarioModal tipo={tipo} />}

//       <ul className="space-y-6">
//         {horarios.map((horario) => {
//           const yaApuntado = horario.reservas.some((r) => r.userId === userId);
//           const completo = horario.reservas.length >= 6;
//           const plazasRestantes = 6 - horario.reservas.length;

//           return (
//             <li key={horario.id} className="border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
//               <div className="p-6 space-y-6">
//                 {/* Sección principal */}
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                   <div className="space-y-2">
//                     <h3 className="text-xl font-semibold text-gray-800">
//                       {horario.dia} - {horario.hora}
//                     </h3>
//                     <p className={`text-sm ${
//                       plazasRestantes > 2 ? 'text-green-600' : 'text-amber-600'
//                     }`}>
//                       {plazasRestantes} plazas disponibles
//                     </p>
//                   </div>

//                   <form
//                     action={(yaApuntado ? cancelarReserva : apuntarseAHorario).bind(null, horario.id, tipo)}
//                     className="w-full md:w-auto"
//                   >
//                     <button
//                       type="submit"
//                       className={`w-full md:w-32 px-4 py-2 rounded-lg font-medium transition-colors ${
//                         yaApuntado
//                           ? 'bg-red-100 text-red-700 hover:bg-red-200'
//                           : completo
//                           ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
//                           : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
//                       }`}
//                       disabled={!yaApuntado && completo}
//                     >
//                       {yaApuntado ? 'Cancelar' : 'Apuntarme'}
//                     </button>
//                   </form>
//                 </div>

//                 {/* Controles de administración */}
//                 {esAdmin && (
//                   <div className="space-y-6 border-t pt-6">
//                     <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
//                       <div className="flex items-center gap-4 w-full md:w-auto">
//                         <EliminarHorarioModal horarioId={horario.id} />
//                         <EditarHorarioModal key={`edit-${horario.id}`} horario={horario} />
//                       </div>

//                       {/* Lista de reservas */}
//                       <div className="bg-gray-50 rounded-lg p-4 w-full">
//                         <h4 className="text-sm font-medium text-gray-600 mb-3">Reservas activas:</h4>
//                         <ul className="space-y-2">
//                           {horario.reservas.map((r, idx) => (
//                             <li key={idx} className="flex justify-between items-center bg-white px-4 py-2 rounded-md">
//                               <span className="text-gray-700">{r.user?.name || "Usuario anónimo"}</span>
//                               <form action={cancelarReservaAdmin.bind(null, horario.id, tipo, r.userId)}>
//                                 <button
//                                   type="submit"
//                                   className="text-red-500 hover:text-red-700 text-sm font-medium"
//                                 >
//                                   Eliminar
//                                 </button>
//                               </form>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// }


import { CrearHorarioModal, EditarHorarioModal, EliminarHorarioModal } from "@/components/HorarioModals";
import { apuntarseAHorario, cancelarReserva, cancelarReservaAdmin } from "@/lib/actions";
import { auth } from "@/auth";
import { getHorariosConReservasPorTipo } from "@/lib/data";

export default async function ListaHorarios({ tipo }) {
  const session = await auth();
  const userId = session?.user?.id;
  const esAdmin = session?.user?.role === "ADMIN";
  const horarios = await getHorariosConReservasPorTipo(tipo);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {esAdmin && <CrearHorarioModal tipo={tipo} />}

      <ul className="space-y-6">
        {horarios.map((horario) => {
          const yaApuntado = horario.reservas.some((r) => r.userId === userId);
          const completo = horario.reservas.length >= 6;
          const plazasRestantes = 6 - horario.reservas.length;

          return (
            <li key={horario.id} className="border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
              <div className="p-6 space-y-6">
                {/* Sección principal */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {horario.dia} - {horario.hora}
                    </h3>
                    <p className={`text-sm ${
                      plazasRestantes > 2 ? 'text-green-600' : 'text-amber-600'
                    }`}>
                      {plazasRestantes} plazas disponibles
                    </p>
                  </div>

                  <form
                    action={(yaApuntado ? cancelarReserva : apuntarseAHorario).bind(null, horario.id, tipo)}
                    className="w-full md:w-auto"
                  >
                    <button
                      type="submit"
                      className={`w-full md:w-32 px-4 py-2 rounded-lg font-medium transition-colors ${
                        yaApuntado
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : completo
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                      disabled={!yaApuntado && completo}
                    >
                      {yaApuntado ? 'Cancelar' : 'Apuntarme'}
                    </button>
                  </form>
                </div>

                {/* Controles de administración */}
                {esAdmin && (
                  <div className="space-y-6 border-t pt-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <EliminarHorarioModal horarioId={horario.id} />
                        <EditarHorarioModal horario={horario} />
                      </div>

                      {/* Lista de reservas */}
                      <div className="bg-gray-50 rounded-lg p-4 w-full">
                        <h4 className="text-sm font-medium text-gray-600 mb-3">Reservas activas:</h4>
                        <ul className="space-y-2">
                          {horario.reservas.map((r, idx) => (
                            <li key={idx} className="flex justify-between items-center bg-white px-4 py-2 rounded-md">
                              <span className="text-gray-700">{r.user?.name || "Usuario anónimo"}</span>
                              <form action={cancelarReservaAdmin.bind(null, horario.id, tipo, r.userId)}>
                                <button
                                  type="submit"
                                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                                >
                                  Eliminar
                                </button>
                              </form>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}