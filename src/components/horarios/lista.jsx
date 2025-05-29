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
                    <p className={`text-sm ${plazasRestantes > 2 ? 'text-green-600' : 'text-amber-600'
                      }`}>
                      {plazasRestantes} plazas disponibles
                    </p>
                  </div>

                  {esAdmin ? (
                    // Controles de administración en lugar del botón Apuntarme
                    <div className="flex gap-4">
                      <EditarHorarioModal horario={horario} />
                      <EliminarHorarioModal horarioId={horario.id} />
                    </div>
                  ) : (
                    // Botón normal para usuarios no administradores
                    <form
                      action={(yaApuntado ? cancelarReserva : apuntarseAHorario).bind(null, horario.id, tipo)}
                      className="w-full md:w-auto"
                    >
                      <button
                        type="submit"
                        className={`w-full md:w-32 px-4 py-2 rounded-lg font-medium transition-colors ${yaApuntado
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
                  )}
                </div>

                {/* Lista de reservas solo para admin */}
                {esAdmin && (
                  <div className="border-t pt-6 space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
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
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}