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
  };
  return dias[dia.toUpperCase()] || dia;
};

// Función para ordenar horarios por día, hora y sala
const ordenarHorarios = (horarios) => {
  const diasOrden = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  
  return horarios.sort((a, b) => {
    const diaA = diasOrden.indexOf(getDiaNombre(a.dia));
    const diaB = diasOrden.indexOf(getDiaNombre(b.dia));
    
    // Si son diferentes días, ordenar por día
    if (diaA !== diaB) return diaA - diaB;
    
    // Si es el mismo día, ordenar por hora
    const horaA = parseInt(a.hora.replace(':', ''));
    const horaB = parseInt(b.hora.replace(':', ''));
    if (horaA !== horaB) return horaA - horaB;
    
    // Si misma hora, ordenar por sala (numéricamente)
    const salaNumA = parseInt(a.sala.split(' ')[1]);
    const salaNumB = parseInt(b.sala.split(' ')[1]);
    return salaNumA - salaNumB;
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
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 capitalize">
  {tipo === 'Pilates' ? 'Pilates terapéutico' : 
   tipo === 'Rehabilitacion_funcional' ? 'Rehabilitación funcional' : 
   tipo === 'Entrenamiento_personal' ? 'Salud activa personal' : 
   tipo.replace(/_/g, ' ')}
</h1>
          <p className="text-gray-600 mt-2">
            {horarios.length} horario{horarios.length !== 1 ? 's' : ''} disponible{horarios.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {esAdmin && (
          <CrearHorarioModal tipo={tipo}>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium">
              <Plus className="w-5 h-5" />
              <span>Nuevo Horario</span>
            </button>
          </CrearHorarioModal>
        )}
      </div>

      {/* Lista de horarios por día */}
      <div className="space-y-8">
        {horarios.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-200">
            <div className="bg-indigo-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No hay horarios disponibles</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Prueba con otro día o consulta más tarde para ver nuevos horarios
            </p>
          </div>
        ) : (
          dias.map(dia => {
            const horariosDelDia = horariosPorDia[dia] || [];
            
            return (
              <div key={dia} className="border border-gray-200 rounded-xl bg-white shadow-md overflow-hidden">
                {/* Cabecera del día */}
                <div className={`p-5 ${
                  dia === 'Lunes' ? 'bg-blue-100' :
                  dia === 'Martes' ? 'bg-indigo-100' :
                  dia === 'Miércoles' ? 'bg-purple-100' :
                  dia === 'Jueves' ? 'bg-pink-100' :
                  dia === 'Viernes' ? 'bg-red-100' :
                  'bg-yellow-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-gray-700" />
                      {dia}
                    </h2>
                    <span className="bg-white text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm border border-gray-200">
                      {horariosDelDia.length} horario{horariosDelDia.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                
                {/* Lista de horarios para este día */}
                <div className="divide-y divide-gray-100">
                  {horariosDelDia.length > 0 ? (
                    horariosDelDia.map(horario => {
                      const yaApuntado = horario.reservas.some((r) => r.userId === userId);
                      const plazasOcupadas = horario.reservas.length;
                      const plazasTotales = 6;
                      const lleno = plazasOcupadas === plazasTotales;
                      const pocasPlazas = plazasOcupadas >= 4 && plazasOcupadas < plazasTotales;

                      return (
                        <div key={horario.id} className="p-6">
                          <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="bg-gray-100 p-3 rounded-lg border border-gray-200">
                                <Clock className="w-6 h-6 text-gray-700" />
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-wrap justify-between gap-3">
                                  <h3 className="text-lg font-bold text-gray-900">
                                    {horario.hora}
                                  </h3>
                                  
                                  {/* Estado de plazas */}
                                  <div className="flex items-center gap-2">
                                    <div className="flex flex-col items-end">
                                      <span className={`text-sm font-semibold ${
                                        lleno
                                          ? 'text-red-600'
                                          : pocasPlazas
                                            ? 'text-amber-600'
                                            : 'text-green-600'
                                      }`}>
                                        {plazasOcupadas} / {plazasTotales} plazas
                                      </span>
                                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                                        <div 
                                          className={`h-full ${
                                            lleno ? 'bg-red-500' : 
                                            pocasPlazas ? 'bg-amber-500' : 'bg-green-500'
                                          }`} 
                                          style={{ width: `${(plazasOcupadas / plazasTotales) * 100}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                    <Users className="w-5 h-5 text-gray-500" />
                                  </div>
                                </div>
                                
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
  tipo === 'Entrenamiento' 
    ? 'bg-blue-100 text-blue-800 border border-blue-200' 
    : 'bg-purple-100 text-purple-800 border border-purple-200'
}`}>
  {tipo === 'Pilates' ? 'Pilates terapéutico' : 
   tipo === 'Rehabilitacion_funcional' ? 'Rehabilitación funcional' : 
   tipo === 'Entrenamiento_personal' ? 'Salud activa personal' : 
   tipo.replace(/_/g, ' ')}
</span>
                                  
                                  {/* Nuevo badge para sala */}
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                    horario.sala === 'Sala 1' 
                                      ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                      : 'bg-teal-100 text-teal-800 border border-teal-200'
                                  }`}>
                                    {horario.sala}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Botones de acción */}
<div className="w-full sm:w-auto flex flex-col sm:flex-row sm:ml-auto sm:justify-end gap-3">
                            {esAdmin && horario.reservas.length > 0 && (
                              <details className="group w-full sm:flex-1">
                                <summary className="flex items-center gap-2 cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium text-sm list-none">
                                  <span>Ver usuarios ({horario.reservas.length})</span>
                                  <ChevronDown className="w-4 h-4 group-open:hidden" />
                                  <ChevronUp className="w-4 h-4 hidden group-open:block" />
                                </summary>

                                <div className="mt-4 bg-gray-50 p-5 rounded-lg border border-gray-200">
                                  <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>Usuarios apuntados:</span>
                                  </h4>
                  
                                  {/* Contenedor grid responsivo */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {horario.reservas.map((r, idx) => (
                                      <div 
                                        key={idx} 
                                        className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                                      >
                                        <div className="flex items-center gap-3">
                                          <span className="font-medium text-gray-800 truncate max-w-[180px]">
                                            {r.user?.name || "Usuario anónimo"}
                                          </span>
                                        </div>
                          
                                        <form action={cancelarReservaAdmin.bind(null, horario.id, tipo, r.userId)}>
                                          <button
                                            type="submit"
                                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                            title="Eliminar reserva"
                                          >
                                            <XCircle className="w-5 h-5" />
                                          </button>
                                        </form>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </details>
                            )}
                            
                            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
                              {esAdmin ? (
                                <>
                                  <EditarHorarioModal horario={horario}>
                                    <button className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors font-medium w-full sm:w-auto">
                                      <Pencil className="w-4 h-4" />
                                      <span>Editar</span>
                                    </button>
                                  </EditarHorarioModal>
                                  
                                  <EliminarHorarioModal horarioId={horario.id}>
                                    <button className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors font-medium w-full sm:w-auto">
                                      <Trash2 className="w-4 h-4" />
                                      <span>Eliminar</span>
                                    </button>
                                  </EliminarHorarioModal>
                                </>
                              ) : (
                                <form 
                                  action={(yaApuntado ? cancelarReserva : apuntarseAHorario).bind(null, horario.id, tipo)}
                                  className="w-full"
                                >
                                  <button
                                    type="submit"
                                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                                      yaApuntado
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                                        : lleno
                                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'
                                          : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border border-indigo-200'
                                    }`}
                                    disabled={lleno || (!yaApuntado && lleno)}
                                  >
                                    {yaApuntado ? (
                                      <>
                                        <XCircle className="w-5 h-5" />
                                        <span>Cancelar reserva</span>
                                      </>
                                    ) : lleno ? (
                                      <span>Lleno</span>
                                    ) : (
                                      <>
                                        <Plus className="w-5 h-5" />
                                        <span>Reservar ahora</span>
                                      </>
                                    )}
                                  </button>
                                </form>
                              )}
                            </div>

                          </div>

                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-gray-500 bg-gray-50 border-t border-gray-100">
                      <CalendarDays className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-600">No hay horarios programados para este día</p>
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
// import { 
//   Calendar, 
//   Clock, 
//   Users, 
//   XCircle, 
//   Pencil, 
//   Trash2, 
//   Plus,
//   CalendarDays,
//   ChevronDown,
//   ChevronUp,
//   User
// } from "lucide-react";
// import Link from "next/link";

// // Función para obtener el nombre del día en español
// const getDiaNombre = (dia) => {
//   const dias = {
//     'MONDAY': 'Lunes',
//     'TUESDAY': 'Martes',
//     'WEDNESDAY': 'Miércoles',
//     'THURSDAY': 'Jueves',
//     'FRIDAY': 'Viernes',
//     'SATURDAY': 'Sábado',
//     'SUNDAY': 'Domingo'
//   };
//   return dias[dia.toUpperCase()] || dia;
// };

// // Función para ordenar horarios por día y hora
// const ordenarHorarios = (horarios) => {
//   const diasOrden = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
//   return horarios.sort((a, b) => {
//     const diaA = diasOrden.indexOf(getDiaNombre(a.dia));
//     const diaB = diasOrden.indexOf(getDiaNombre(b.dia));
    
//     // Si son diferentes días, ordenar por día
//     if (diaA !== diaB) return diaA - diaB;
    
//     // Si es el mismo día, ordenar por hora
//     const horaA = parseInt(a.hora.replace(':', ''));
//     const horaB = parseInt(b.hora.replace(':', ''));
//     return horaA - horaB;
//   });
// };

// export default async function ListaHorarios({ tipo }) {
//   const session = await auth();
//   const userId = session?.user?.id;
//   const esAdmin = session?.user?.role === "ADMIN";
//   const horarios = await getHorariosConReservasPorTipo(tipo);
//   const horariosOrdenados = ordenarHorarios(horarios);

//   // Agrupar horarios por día
//   const horariosPorDia = {};
//   horariosOrdenados.forEach(horario => {
//     const dia = getDiaNombre(horario.dia);
//     if (!horariosPorDia[dia]) {
//       horariosPorDia[dia] = [];
//     }
//     horariosPorDia[dia].push(horario);
//   });

//   // Días ordenados
//   const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

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

//       {/* Lista de horarios por día */}
//       <div className="space-y-8">
//         {horarios.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
//               <CalendarDays className="w-8 h-8 text-gray-400" />
//             </div>
//             <h3 className="text-xl font-medium text-gray-700">No hay horarios disponibles</h3>
//             <p className="text-gray-500 mt-2">Prueba con otro día o consulta más tarde</p>
//           </div>
//         ) : (
//           dias.map(dia => {
//             const horariosDelDia = horariosPorDia[dia] || [];
            
//             return (
//               <div key={dia} className="border rounded-xl bg-white shadow-sm overflow-hidden">
//                 {/* Cabecera del día */}
//                 <div className="bg-indigo-50 p-4 border-b">
//                   <div className="flex items-center justify-between">
//                     <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
//                       <Calendar className="w-6 h-6 text-indigo-600" />
//                       {dia}
//                     </h2>
//                     <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
//                       {horariosDelDia.length} horario{horariosDelDia.length !== 1 ? 's' : ''}
//                     </span>
//                   </div>
//                 </div>
                
//                 {/* Lista de horarios para este día */}
//                 <div className="divide-y">
//                   {horariosDelDia.length > 0 ? (
//                     horariosDelDia.map(horario => {
//                       const yaApuntado = horario.reservas.some((r) => r.userId === userId);
//                       const completo = horario.reservas.length >= 6;
//                       const plazasRestantes = 6 - horario.reservas.length;
//                       const lleno = plazasRestantes === 0;

//                       return (
//                         <div key={horario.id} className="p-5">
//                           <div className="flex flex-col md:flex-row justify-between gap-4">
//                             <div className="flex items-center gap-4">
//                               <div className="bg-indigo-50 p-3 rounded-lg">
//                                 <Clock className="w-6 h-6 text-indigo-600" />
//                               </div>
//                               <div>
//                                 <h3 className="text-lg font-semibold text-gray-800">
//                                   {horario.hora}
//                                 </h3>
//                               </div>
//                             </div>

//                             {/* Estado de plazas */}
//                             <div className="flex flex-col items-end">
//                               <div className="flex items-center gap-2">
//                                 <Users className="w-5 h-5 text-gray-500" />
//                                 <span className={`text-base font-medium ${
//                                   lleno
//                                     ? 'text-red-600'
//                                     : plazasRestantes > 2
//                                       ? 'text-green-600'
//                                       : 'text-amber-600'
//                                 }`}>
//                                   {lleno ? 'Lleno' : `${plazasRestantes} / 6 plazas`}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Botones de acción */}
//                           <div className="mt-4 flex justify-end">
//                             {esAdmin ? (
//                               <div className="flex gap-3">
//                                 <EditarHorarioModal horario={horario}>
//                                   <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors text-sm">
//                                     <Pencil className="w-4 h-4" />
//                                     <span>Editar</span>
//                                   </button>
//                                 </EditarHorarioModal>
                                
//                                 <EliminarHorarioModal horarioId={horario.id}>
//                                   <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors text-sm">
//                                     <Trash2 className="w-4 h-4" />
//                                     <span>Eliminar</span>
//                                   </button>
//                                 </EliminarHorarioModal>
//                               </div>
//                             ) : (
//                               <form 
//                                 action={(yaApuntado ? cancelarReserva : apuntarseAHorario).bind(null, horario.id, tipo)}
//                                 className="w-full md:w-auto"
//                               >
//                                 <button
//                                   type="submit"
//                                   className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
//                                     yaApuntado
//                                       ? 'bg-red-50 text-red-700 hover:bg-red-100'
//                                       : completo || lleno
//                                         ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
//                                         : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
//                                   }`}
//                                   disabled={completo || lleno || (!yaApuntado && completo)}
//                                 >
//                                   {yaApuntado ? (
//                                     <>
//                                       <XCircle className="w-5 h-5" />
//                                       <span>Cancelar</span>
//                                     </>
//                                   ) : completo || lleno ? (
//                                     <span>Lleno</span>
//                                   ) : (
//                                     <>
//                                       <Plus className="w-5 h-5" />
//                                       <span>Reservar</span>
//                                     </>
//                                   )}
//                                 </button>
//                               </form>
//                             )}
//                           </div>

//                           {/* Lista de usuarios para admin - Implementación servidor */}
//                           {esAdmin && horario.reservas.length > 0 && (
//                             <details className="mt-4 group">
//                               <summary className="flex items-center gap-2 cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium list-none">
//                                 <span>Ver usuarios ({horario.reservas.length})</span>
//                                 <ChevronDown className="w-4 h-4 group-open:hidden" />
//                                 <ChevronUp className="w-4 h-4 hidden group-open:block" />
//                               </summary>
                              
//                               <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
//                                 <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
//                                   <User className="w-4 h-4" />
//                                   <span>Usuarios apuntados:</span>
//                                 </h4>
                                
//                                 <ul className="space-y-2">
//                                   {horario.reservas.map((r, idx) => (
//                                     <li 
//                                       key={idx} 
//                                       className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
//                                     >
//                                       <div className="flex items-center gap-3">
//                                         <span className="text-gray-700">
//                                           {r.user?.name || "Usuario anónimo"}
//                                         </span>
//                                       </div>
                                      
//                                       <form action={cancelarReservaAdmin.bind(null, horario.id, tipo, r.userId)}>
//                                         <button
//                                           type="submit"
//                                           className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
//                                           title="Eliminar reserva"
//                                         >
//                                           <XCircle className="w-5 h-5" />
//                                         </button>
//                                       </form>
//                                     </li>
//                                   ))}
//                                 </ul>
//                               </div>
//                             </details>
//                           )}
//                         </div>
//                       );
//                     })
//                   ) : (
//                     <div className="p-5 text-center text-gray-500">
//                       No hay horarios para este día
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }
