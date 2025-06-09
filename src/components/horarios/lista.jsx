import { CrearHorarioModal, EditarHorarioModal, EliminarHorarioModal } from "@/components/HorarioModals";
import { apuntarseAHorario, cancelarReserva, cancelarReservaAdmin } from "@/lib/actions";
import { auth } from "@/auth";
import { getHorariosConReservasPorTipo } from "@/lib/data";
import {
  Clock,
  XCircle,
  Plus,
  CalendarDays,
  ChevronDown,
  Users
} from "lucide-react";

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
   <div className="w-full max-w-4xl mx-auto py-2 px-1">
      {/* Encabezado - Hacer componente */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#4d4037] capitalize">
            {tipo === 'Pilates' ? 'Pilates terapéutico' :
              tipo === 'Rehabilitacion_funcional' ? 'Rehabilitación funcional' :
                tipo === 'Entrenamiento_personal' ? 'Salud activa personal' :
                  tipo.replace(/_/g, ' ')}
          </h1>
        </div>

        {esAdmin && (
          <CrearHorarioModal tipo={tipo} />
        )}
      </div>

      {/* Lista de horarios por día */}
      <div className="space-y-8">
        {dias.map(dia => {
          const horariosDelDia = horariosPorDia[dia] || [];

          return (
            <div key={dia} className="border border-gray-200 rounded-xl bg-white shadow-md overflow-hidden">
              {/* Cabecera del día */}
              <div className={`p-5 bg-[#b9b59c]`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-[#3d332c] flex items-center gap-3">
                      {dia}
                    </h2>
                  </div>

                  <span className="bg-[#e8d7c3] text-[#3d332c] px-3 py-1.5 rounded-full text-sm font-medium shadow-sm border border-[#3d332c]">
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
                        <div className="flex justify-between items-start">
                          {/* IZQUIERDA: Reloj y sala debajo */}
                          <div className="flex flex-row-reverse gap-4 sm:gap-6">
                            <span
                              className={`inline-flex items-center px-5 py-1 h-8 rounded-full  text-xs font-medium ${horario.sala === 'Sala 1'
                                ? 'bg-amber-100 text-amber-800 border border-amber-500'
                                : 'bg-[#fac156] text-[#913b02] border border-[#823400]'
                                }`}
                            >
                              {horario.sala}
                            </span>
                            <div className="flex flex-col items-start">
                              <div className="bg-gray-100 p-3 rounded-lg border border-gray-200 text-center">
                                <Clock className="mx-auto w-6 h-6 text-gray-700" />
                                <div className="text-sm font-semibold text-gray-900 mt-1">
                                  {horario.hora}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* DERECHA: Plazas y barra */}
                          <div className="flex flex-col items-end gap-2">
                            <span
                              className={`text-sm font-semibold ${lleno
                                ? 'text-red-600'
                                : pocasPlazas
                                  ? 'text-amber-600'
                                  : 'text-green-600'
                                }`}
                            >
                              {plazasOcupadas} / {plazasTotales} plazas
                            </span>

                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${lleno
                                  ? 'bg-red-500'
                                  : pocasPlazas
                                    ? 'bg-amber-500'
                                    : 'bg-green-500'
                                  }`}
                                style={{
                                  width: `${(plazasOcupadas / plazasTotales) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:ml-auto sm:justify-end gap-3 mt-5">
                          <div className="w-full flex justify-between items-center flex-wrap gap-3">

                            <div className="w-full flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                              <div className="w-full flex flex-col md:flex-col gap-4">
                                {/* Botones en escritorio encima */}
                                <div className="flex justify-end gap-4">
                                  {esAdmin ? (
                                    <>
                                      <EditarHorarioModal horario={horario} />
                                        
                                      <EliminarHorarioModal horarioId={horario.id} />
                                        
                                    </>
                                  ) : (
                                    <form
                                      action={(yaApuntado ? cancelarReserva : apuntarseAHorario).bind(null, horario.id, tipo)}
                                      className=""
                                    >
                                      <button
                                        type="submit"
                                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${yaApuntado
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

                                {/* Desplegable usuarios (visible en móvil y en escritorio con margen arriba) */}
                                {esAdmin && horario.reservas.length > 0 && (
                                  <details className="group w-full md:mt-4">
                                    <summary className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors list-none">
                                      <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-[#4d4037]" />
                                        <span className="font-medium text-[#4d4037] group-open:text-[#4d4037]">
                                          Ver usuarios apuntados ({horario.reservas.length})
                                        </span>
                                      </div>
                                      <div className="transform transition-transform group-open:rotate-180">
                                        <ChevronDown className="w-4 h-4 text-gray-500" />
                                      </div>
                                    </summary>

                                    <div className="mt-2 bg-white p-3 rounded-lg border border-gray-200 shadow-sm max-h-[400px] overflow-y-auto">
                                      <table className="w-full table-auto border-collapse text-sm text-left">
                                        <thead>
                                          <tr className="bg-[#a57551ae] text-indigo-700">
                                            <th className="text-[#4d4037] px-3 py-2 border-b border-indigo-200">Usuario</th>
                                            <th className="text-[#4d4037] px-3 py-2 border-b border-indigo-200 text-center">Acción</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {horario.reservas.map((r, idx) => (
                                            <tr key={idx} className="odd:bg-[#faf8f5] even:bg-white">
                                              <td className="flex items-center gap-3 px-3 py-2 max-w-xs truncate">
                                                <span className="font-medium text-gray-800 truncate">
                                                  {r.user?.name || "Usuario anónimo"}
                                                </span>
                                              </td>
                                              <td className="px-3 py-2 text-center">
                                                <form
                                                  action={cancelarReservaAdmin.bind(null, horario.id, tipo, r.userId)}
                                                  className="inline-block"
                                                >
                                                  <button
                                                    type="submit"
                                                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                                    title="Eliminar reserva"
                                                  >
                                                    <XCircle className="w-5 h-5 cursor-pointer" />
                                                  </button>
                                                </form>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </details>
                                )}
                              </div>
                            </div>
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
        })}
      </div>
    </div>
  );
}