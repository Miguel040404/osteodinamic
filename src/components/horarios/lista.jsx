import { CrearHorarioModal, EditarHorarioModal, EliminarHorarioModal } from "@/components/HorarioModals";
import { apuntarseAHorario, cancelarReserva, cancelarReservaAdmin } from "@/lib/actions";
import { auth } from "@/auth";
import { getHorariosConReservasPorTipo } from "@/lib/data";
import { 
  Calendar, 
  Clock, 
  Users, 
  XCircle, 
  Pencil, 
  Trash2, 
  Plus,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  User
} from "lucide-react";
import Link from "next/link";

// Función para obtener el nombre del día en español
const getDiaNombre = (dia) => {
  const dias = {
    'MONDAY': 'Lunes',
    'TUESDAY': 'Martes',
    'WEDNESDAY': 'Miércoles',
    'THURSDAY': 'Jueves',
    'FRIDAY': 'Viernes',
    'SATURDAY': 'Sábado',
    'SUNDAY': 'Domingo'
  };
  return dias[dia.toUpperCase()] || dia;
};

// Función para ordenar horarios por día y hora
const ordenarHorarios = (horarios) => {
  const diasOrden = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  return horarios.sort((a, b) => {
    const diaA = diasOrden.indexOf(getDiaNombre(a.dia));
    const diaB = diasOrden.indexOf(getDiaNombre(b.dia));
    
    // Si son diferentes días, ordenar por día
    if (diaA !== diaB) return diaA - diaB;
    
    // Si es el mismo día, ordenar por hora
    const horaA = parseInt(a.hora.replace(':', ''));
    const horaB = parseInt(b.hora.replace(':', ''));
    return horaA - horaB;
  });
};

export default async function ListaHorarios({ tipo }) {
  const session = await auth();
  const userId = session?.user?.id;
  const esAdmin = session?.user?.role === "ADMIN";
  const horarios = await getHorariosConReservasPorTipo(tipo);
  const horariosOrdenados = ordenarHorarios(horarios);

  // Agrupar horarios por día
  const horariosPorDia = {};
  horariosOrdenados.forEach(horario => {
    const dia = getDiaNombre(horario.dia);
    if (!horariosPorDia[dia]) {
      horariosPorDia[dia] = [];
    }
    horariosPorDia[dia].push(horario);
  });

  // Días ordenados
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 capitalize">
            {tipo.replace(/_/g, ' ')}
          </h1>
          <p className="text-gray-500 mt-1">
            {horarios.length} horario{horarios.length !== 1 ? 's' : ''} disponible{horarios.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {esAdmin && (
          <CrearHorarioModal tipo={tipo}>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow-md">
              <Plus className="w-5 h-5" />
              <span>Nuevo Horario</span>
            </button>
          </CrearHorarioModal>
        )}
      </div>

      {/* Lista de horarios por día */}
      <div className="space-y-8">
        {horarios.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-700">No hay horarios disponibles</h3>
            <p className="text-gray-500 mt-2">Prueba con otro día o consulta más tarde</p>
          </div>
        ) : (
          dias.map(dia => {
            const horariosDelDia = horariosPorDia[dia] || [];
            
            return (
              <div key={dia} className="border rounded-xl bg-white shadow-sm overflow-hidden">
                {/* Cabecera del día */}
                <div className="bg-indigo-50 p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-indigo-600" />
                      {dia}
                    </h2>
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                      {horariosDelDia.length} horario{horariosDelDia.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                
                {/* Lista de horarios para este día */}
                <div className="divide-y">
                  {horariosDelDia.length > 0 ? (
                    horariosDelDia.map(horario => {
                      const yaApuntado = horario.reservas.some((r) => r.userId === userId);
                      const completo = horario.reservas.length >= 6;
                      const plazasRestantes = 6 - horario.reservas.length;
                      const lleno = plazasRestantes === 0;

                      return (
                        <div key={horario.id} className="p-5">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="bg-indigo-50 p-3 rounded-lg">
                                <Clock className="w-6 h-6 text-indigo-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                  {horario.hora}
                                </h3>
                              </div>
                            </div>

                            {/* Estado de plazas */}
                            <div className="flex flex-col items-end">
                              <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-gray-500" />
                                <span className={`text-base font-medium ${
                                  lleno
                                    ? 'text-red-600'
                                    : plazasRestantes > 2
                                      ? 'text-green-600'
                                      : 'text-amber-600'
                                }`}>
                                  {lleno ? 'Lleno' : `${plazasRestantes} / 6 plazas`}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Botones de acción */}
                          <div className="mt-4 flex justify-end">
                            {esAdmin ? (
                              <div className="flex gap-3">
                                <EditarHorarioModal horario={horario}>
                                  <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors text-sm">
                                    <Pencil className="w-4 h-4" />
                                    <span>Editar</span>
                                  </button>
                                </EditarHorarioModal>
                                
                                <EliminarHorarioModal horarioId={horario.id}>
                                  <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors text-sm">
                                    <Trash2 className="w-4 h-4" />
                                    <span>Eliminar</span>
                                  </button>
                                </EliminarHorarioModal>
                              </div>
                            ) : (
                              <form 
                                action={(yaApuntado ? cancelarReserva : apuntarseAHorario).bind(null, horario.id, tipo)}
                                className="w-full md:w-auto"
                              >
                                <button
                                  type="submit"
                                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                                    yaApuntado
                                      ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                      : completo || lleno
                                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                  }`}
                                  disabled={completo || lleno || (!yaApuntado && completo)}
                                >
                                  {yaApuntado ? (
                                    <>
                                      <XCircle className="w-5 h-5" />
                                      <span>Cancelar</span>
                                    </>
                                  ) : completo || lleno ? (
                                    <span>Lleno</span>
                                  ) : (
                                    <>
                                      <Plus className="w-5 h-5" />
                                      <span>Reservar</span>
                                    </>
                                  )}
                                </button>
                              </form>
                            )}
                          </div>

                          {/* Lista de usuarios para admin - Implementación servidor */}
                          {esAdmin && horario.reservas.length > 0 && (
                            <details className="mt-4 group">
                              <summary className="flex items-center gap-2 cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium list-none">
                                <span>Ver usuarios ({horario.reservas.length})</span>
                                <ChevronDown className="w-4 h-4 group-open:hidden" />
                                <ChevronUp className="w-4 h-4 hidden group-open:block" />
                              </summary>
                              
                              <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  <span>Usuarios apuntados:</span>
                                </h4>
                                
                                <ul className="space-y-2">
                                  {horario.reservas.map((r, idx) => (
                                    <li 
                                      key={idx} 
                                      className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                                    >
                                      <div className="flex items-center gap-3">
                                        <span className="text-gray-700">
                                          {r.user?.name || "Usuario anónimo"}
                                        </span>
                                      </div>
                                      
                                      <form action={cancelarReservaAdmin.bind(null, horario.id, tipo, r.userId)}>
                                        <button
                                          type="submit"
                                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                                          title="Eliminar reserva"
                                        >
                                          <XCircle className="w-5 h-5" />
                                        </button>
                                      </form>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </details>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-5 text-center text-gray-500">
                      No hay horarios para este día
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// import { CrearHorarioModal, EditarHorarioModal, EliminarHorarioModal } from "@/components/HorarioModals";
// import { apuntarseAHorario, cancelarReserva, cancelarReservaAdmin } from "@/lib/actions";
// import { auth } from "@/auth";
// import { getHorariosConReservasPorTipo } from "@/lib/data";
// import {User, Calendar, Clock, Users, XCircle, Pencil, Trash2, Plus, CalendarDays } from "lucide-react";
// export default async function ListaHorarios({ tipo }) {
//   const session = await auth();
//   const userId = session?.user?.id;
//   const esAdmin = session?.user?.role === "ADMIN";
//   const horarios = await getHorariosConReservasPorTipo(tipo);

//   // Función para obtener el nombre del día en español
//   const getDiaNombre = (dia) => {
//     const dias = {
//       'MONDAY': 'Lunes',
//       'TUESDAY': 'Martes',
//       'WEDNESDAY': 'Miércoles',
//       'THURSDAY': 'Jueves',
//       'FRIDAY': 'Viernes'
    
//     };
//     return dias[dia.toUpperCase()] || dia;
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* Encabezado */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800 capitalize">
//             {tipo.replace(/_/g, ' ')}
//           </h1>
//           <p className="text-gray-500 mt-1">
//             {horarios.length} horario{horarios.length !== 1 ? 's' : ''} disponible{horarios.length !== 1 ? 's' : ''}
//           </p>
//         </div>

//         {esAdmin && (
//           <CrearHorarioModal tipo={tipo}>
//             <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow-md">
//               <Plus className="w-5 h-5" />
//               <span>Nuevo Horario</span>
//             </button>
//           </CrearHorarioModal>
//         )}
//       </div>

//       {/* Lista de horarios */}
//       <div className="space-y-6">
//         {horarios.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
//               <CalendarDays className="w-8 h-8 text-gray-400" />
//             </div>
//             <h3 className="text-xl font-medium text-gray-700">No hay horarios disponibles</h3>
//             <p className="text-gray-500 mt-2">Prueba con otro día o consulta más tarde</p>
//           </div>
//         ) : (
//           horarios.map((horario) => {
//             const yaApuntado = horario.reservas.some((r) => r.userId === userId);
//             const completo = horario.reservas.length >= 6;
//             const plazasRestantes = 6 - horario.reservas.length;
//             const porcentaje = (horario.reservas.length / 6) * 100;
//             const lleno = plazasRestantes === 0;

//             return (
//               <div
//                 key={horario.id}
//                 className="border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
//               >
//                 <div className="p-6"> {/* Aumentado a p-6 para más espacio */}
//                   {/* Cabecera del horario - Más grande */}
//                   <div className="flex flex-col md:flex-row justify-between gap-4">
//                     <div className="flex items-start gap-4">
//                       <div className="bg-indigo-50 p-3.5 rounded-lg"> {/* Icono más grande */}
//                         <Calendar className="w-7 h-7 text-indigo-600" /> {/* Icono más grande */}
//                       </div>
//                       <div>
//                         <h3 className="text-xl font-semibold text-gray-800"> {/* Texto más grande */}
//                           {getDiaNombre(horario.dia)}
//                         </h3>
//                         <div className="flex items-center gap-2 mt-2 text-gray-600"> {/* Más espacio */}
//                           <Clock className="w-5 h-5" /> {/* Icono más grande */}
//                           <span className="text-lg">{horario.hora}</span> {/* Texto más grande */}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Plazas disponibles - Más grande y con estado "Lleno" */}
//                     <div className="flex flex-col items-end">
//                       <div className="flex items-center gap-2">
//                         <Users className="w-6 h-6 text-gray-500" /> {/* Icono más grande */}
//                         <span className={`text-base font-medium ${ // Texto más grande
//                           lleno
//                             ? 'text-red-600'
//                             : plazasRestantes > 2
//                               ? 'text-green-600'
//                               : 'text-amber-600'
//                           }`}>
//                           {lleno ? 'Lleno' : `${plazasRestantes} / 6 plazas`}
//                         </span>
//                       </div>

//                       {/* Barra de progreso más grande */}
//                       <div className="w-40 h-2.5 bg-gray-100 rounded-full overflow-hidden mt-2.5">
//                         <div
//                           className={`h-full ${ // Color rojo cuando está lleno
//                             lleno
//                               ? 'bg-red-500'
//                               : porcentaje < 70
//                                 ? 'bg-green-500'
//                                 : 'bg-amber-500'
//                             }`}
//                           style={{ width: `${porcentaje}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Botones de acción - Más grandes */}
//                   <div className="mt-7 flex flex-col sm:flex-row gap-3"> {/* Más espacio arriba */}
//                     {esAdmin ? (
//                       <div className="flex gap-3">
//                         <EditarHorarioModal horario={horario}>
//                           <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg transition-colors">
//                             <Pencil className="w-5 h-5" /> {/* Icono más grande */}
//                             <span className="text-base">Editar</span> {/* Texto más grande */}
//                           </button>
//                         </EditarHorarioModal>

//                         <EliminarHorarioModal horarioId={horario.id}>
//                           <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg transition-colors">
//                             <Trash2 className="w-5 h-5" /> {/* Icono más grande */}
//                             <span className="text-base">Eliminar</span> {/* Texto más grande */}
//                           </button>
//                         </EliminarHorarioModal>
//                       </div>
//                     ) : (
//                       <form
//                         action={(yaApuntado ? cancelarReserva : apuntarseAHorario).bind(null, horario.id, tipo)}
//                         className="w-full"
//                       >
//                         <button
//                           type="submit"
//                           className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${yaApuntado
//                               ? 'bg-red-50 text-red-700 hover:bg-red-100'
//                               : completo || lleno
//                                 ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
//                                 : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
//                             }`}
//                           disabled={completo || lleno || (!yaApuntado && completo)}
//                         >
//                           {yaApuntado ? (
//                             <>
//                               <XCircle className="w-6 h-6" />
//                               <span className="text-base">Cancelar reserva</span>
//                             </>
//                           ) : completo || lleno ? (
//                             <span className="text-base">Lleno</span>
//                           ) : (
//                             <>
//                               <Plus className="w-6 h-6" />
//                               <span className="text-base">Reservar plaza</span>
//                             </>
//                           )}
//                         </button>
//                       </form>
//                     )}
//                   </div>
//                 </div>

//                 {/* Lista de reservas para admin - Más grande */}
//                 {esAdmin && horario.reservas.length > 0 && (
//                   <div className="border-t">
//                     <div className="p-6 bg-gray-50"> {/* Padding aumentado */}
//                       <h4 className="text-base font-medium text-gray-700 mb-4 flex items-center gap-2"> {/* Texto más grande */}
//                         <User className="w-5 h-5" /> {/* Icono más grande */}
//                         <span>Reservas ({horario.reservas.length})</span>
//                       </h4>

//                       <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Más espacio entre elementos */}
//                         {horario.reservas.map((r, idx) => (
//                           <li
//                             key={idx}
//                             className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200" /* Padding aumentado */
//                           >
//                             <div className="flex items-center gap-3">
//                               <span className="text-gray-700 font-medium text-base"> {/* Texto más grande */}
//                                 {r.user?.name || "Usuario anónimo"}
//                               </span>
//                             </div>

//                             <form action={cancelarReservaAdmin.bind(null, horario.id, tipo, r.userId)}>
//                               <button
//                                 type="submit"
//                                 className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50"
//                                 title="Eliminar reserva"
//                               >
//                                 <XCircle className="w-6 h-6" /> {/* Icono más grande */}
//                               </button>
//                             </form>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }

// viejo

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
//                     <p className={`text-sm ${plazasRestantes > 2 ? 'text-green-600' : 'text-amber-600'
//                       }`}>
//                       {plazasRestantes} plazas disponibles
//                     </p>
//                   </div>

//                   {esAdmin ? (
//                     // Controles de administración en lugar del botón Apuntarme
//                     <div className="flex gap-4">
//                       <EditarHorarioModal horario={horario} />
//                       <EliminarHorarioModal horarioId={horario.id} />
//                     </div>
//                   ) : (
//                     // Botón normal para usuarios no administradores
//                     <form
//                       action={(yaApuntado ? cancelarReserva : apuntarseAHorario).bind(null, horario.id, tipo)}
//                       className="w-full md:w-auto"
//                     >
//                       <button
//                         type="submit"
//                         className={`w-full md:w-32 px-4 py-2 rounded-lg font-medium transition-colors ${yaApuntado
//                             ? 'bg-red-100 text-red-700 hover:bg-red-200'
//                             : completo
//                               ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
//                               : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
//                           }`}
//                         disabled={!yaApuntado && completo}
//                       >
//                         {yaApuntado ? 'Cancelar' : 'Apuntarme'}
//                       </button>
//                     </form>
//                   )}
//                 </div>

//                 {/* Lista de reservas solo para admin */}
//                 {esAdmin && (
//                   <div className="border-t pt-6 space-y-4">
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