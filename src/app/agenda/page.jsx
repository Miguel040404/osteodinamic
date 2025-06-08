import Footer from "@/components/footer";
import {
  getReservasDelUsuario,
  getTodasReservas,
  cancelarReserva,
  cancelarReservaAdmin,
} from "@/lib/actions";
import { auth } from "@/auth";
import { Suspense } from "react";
import { redirect } from "next/navigation";

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
// Crear componente
const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#f9faf5] bg-opacity-80">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#a57551] mx-auto"></div>
      <p className="mt-4 text-lg text-[#4d4037] flex justify-center">
        Cargando agenda
        <span className="flex">
          <span className="animate-bounce">.</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
        </span>
      </p>
    </div>
  </div>
);

export default function AgendaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br bg-[#F2F1E8] text-slate-800">
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

  if (!session) {
    return (
      redirect('/auth/login')
    )
  }
  const userId = session?.user?.id;
  const esAdmin = session?.user?.role === "ADMIN";

  const reservas = esAdmin ? await getTodasReservas() : await getReservasDelUsuario(userId);

  return <AgendaContent reservas={reservas} esAdmin={esAdmin} />;
}

function AgendaContent({ reservas, esAdmin }) {
  return (
    <>
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#4d4037] mb-2">
          {esAdmin ? "Panel de Administración" : "Mi Agenda"}
        </h1>
        <p className="text-[#a57551] max-w-2xl mx-auto">
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
    <div className="bg-[#f9eee1] rounded-xl shadow-lg p-6">
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
            <h2 className="text-2xl font-bold text-[#4d4037] mb-6 pb-2 border-b border-[#d8c4ae]">
              {tipo === 'Pilates'
                ? 'Pilates terapéutico'
                : tipo === 'Rehabilitacion_funcional'
                  ? 'Rehabilitación funcional'
                  : tipo === 'Entrenamiento_personal'
                    ? 'Salud activa personal'
                    : tipo}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {horariosOrdenados.map((grupo) => (
                <div
                  key={`${grupo.horario.dia}-${grupo.horario.hora}`}
                  className="border border-[#d8c4ae] rounded-xl p-5 bg-[#fffaf5] shadow hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <div className="text-[#4d4037] font-bold text-lg">
                        {grupo.horario.dia}
                      </div>
                      <div className="text-[#6c5f57] text-sm">
                        <span className="font-semibold">Próxima fecha:</span>{" "}
                        {getProximaFecha(grupo.horario.dia, grupo.horario.hora)}
                      </div>
                      <div className="text-[#6c5f57] text-sm">
                        <span className="font-semibold">Hora:</span> {grupo.horario.hora}
                      </div>
                      <div className="text-[#6c5f57] text-sm">
                        <span className="font-semibold">Sala:</span> {grupo.horario.sala}
                      </div>
                    </div>

                    <div className="bg-[#eaddce] text-[#3d332c] rounded-full px-3 py-1 text-sm font-medium border border-[#b8a28a] whitespace-nowrap">
                      {grupo.usuarios.length}{" "}
                      {grupo.usuarios.length === 1 ? "participante" : "participantes"}
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {grupo.usuarios.map((usuario) => (
                      <li
                        key={usuario.id}
                        className="flex justify-between items-center bg-[#f3e5d8] rounded-lg px-3 py-2 border border-[#d6c1a8]"
                      >
                        <span className="font-medium text-[#3d332c]">{usuario.name}</span>
                        <form
                          action={cancelarReservaAdmin.bind(
                            null,
                            grupo.horario.id,
                            grupo.horario.tipo,
                            usuario.id
                          )}
                        >
                          <button
                            type="submit"
                            className="text-rose-600 hover:text-rose-700 text-sm font-semibold cursor-pointer"
                          >
                            Cancelar
                          </button>
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
    <div className="bg-[#fdf8f4] rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#4d4037]">Mis reservas</h2>
        <div className="text-sm font-medium px-3 py-1 bg-[#f4e3c9] text-[#5b3a29] rounded-full border border-[#dfc7aa]">
          {reservas.length} {reservas.length === 1 ? "reserva" : "reservas"}
        </div>
      </div>

      {reservas.length === 0 ? (
        <div className="text-center py-12 text-[#7b6e66]">
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
                  ? "border-[#dbc7b0] bg-[#f4ebe3]"
                  : "border-[#c7b1a1] bg-[#f3e6dc]"
              }`}
            >
              <div className="flex-1 mb-4 md:mb-0">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="flex items-center text-[#5b3a29]">
                    <span className="font-bold">{reserva.horario.dia}</span>
                    <span className="mx-2 text-[#a89989]">•</span>
                    <span className="font-medium">{reserva.horario.hora}</span>
                    <span className="mx-2 text-[#a89989]">•</span>
                    <span className="font-medium">{reserva.horario.sala}</span>
                  </div>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      reserva.horario.tipo === "Entrenamiento"
                        ? "bg-[#e9d5c1] text-[#5b3a29]"
                        : "bg-[#dcc1ac] text-[#4d4037]"
                    }`}
                  >
                    {reserva.horario.tipo === "Pilates"
                      ? "Pilates terapéutico"
                      : reserva.horario.tipo === "Rehabilitacion_funcional"
                      ? "Rehabilitación funcional"
                      : reserva.horario.tipo === "Entrenamiento_personal"
                      ? "Salud activa personal"
                      : reserva.horario.tipo}
                  </div>
                </div>
                <div className="text-sm text-[#7b6e66]">
                  Fecha: {getProximaFecha(reserva.horario.dia, reserva.horario.hora)}
                </div>
              </div>
              <form
                action={cancelarReserva.bind(null, reserva.horarioId, reserva.horario.tipo)}
                className="w-full md:w-auto"
              >
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-[#fae5e0] text-[#a23b2e] border border-[#e2b4ac] rounded-lg hover:bg-[#f2d4ce] transition cursor-pointer"
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
