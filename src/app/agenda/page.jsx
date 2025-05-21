// 'use client';
// import React, { useState } from 'react';
// import Header from "@/components/header";
// import Footer from "@/components/footer";

// function Agenda() {
//     const [tareas, setTareas] = useState([
//         { id: 1, texto: 'Reunión con el equipo', completada: false },
//         { id: 2, texto: 'Enviar reporte mensual', completada: false },
//         { id: 3, texto: 'Llamar a cliente', completada: false },
//     ]);

//     const toggleTarea = (id) => {
//         setTareas(tareas.map(t =>
//             t.id === id ? { ...t, completada: !t.completada } : t
//         ));
//     };

//     return (
//         <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
//             <Header />

//             <main className="flex-1 container mx-auto px-4 py-8">
//                 <h1 className="text-2xl font-bold mb-4">Agenda</h1>
//                 <ul className="space-y-3">
//                     {tareas.map((tarea) => (
//                         <li
//                             key={tarea.id}
//                             className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
//                                 tarea.completada ? 'bg-green-100 line-through text-gray-500' : 'bg-white'
//                             }`}
//                         >
//                             <span>{tarea.texto}</span>
//                             <button
//                                 onClick={() => toggleTarea(tarea.id)}
//                                 className={`text-sm px-3 py-1 rounded-lg ${
//                                     tarea.completada
//                                         ? 'bg-green-400 text-white hover:bg-green-500'
//                                         : 'bg-blue-500 text-white hover:bg-blue-600'
//                                 }`}
//                             >
//                                 {tarea.completada ? 'Desmarcar' : 'Marcar'}
//                             </button>
//                         </li>
//                     ))}
//                 </ul>
//             </main>

//             <Footer />
//         </div>
//     );
// }

// export default Agenda;


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
  "Sábado": 6,
  "Domingo": 7
};

export default async function AgendaPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const esAdmin = session?.user?.role === "ADMIN";

  // Obtener datos según rol
  let reservas = esAdmin
    ? await getTodasReservas()
    : await getReservasDelUsuario(userId);

  // Ordenar y agrupar reservas para admins
  if (esAdmin) {
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
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-12 md:py-20">
          <h1 className="text-2xl font-bold mb-4">Todas las reservas</h1>

          <div className="space-y-6">
            {Object.values(horariosAgrupados).map((grupo) => (
              <div key={`${grupo.horario.dia}-${grupo.horario.hora}`} className="border p-4 rounded-lg bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="font-semibold">
                      {grupo.horario.dia} - {grupo.horario.hora}
                    </h2>
                    <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {grupo.horario.tipo}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    Participantes: {grupo.usuarios.length} 
                  </span>
                </div>

                <ul className="space-y-2">
                  {grupo.usuarios.map((usuario) => (
                    <li key={usuario.id} className="flex justify-between items-center px-2 py-1">
                      <span>{usuario.name}</span>
                      <form action={cancelarReservaAdmin.bind(null, grupo.horario.id, grupo.horario.tipo, usuario.id)}>
                        <button
                          type="submit"
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Eliminar
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </main>
        {/* ARREGLO PERUANO PANI */}
        <div className="mt-12">
          <Footer />
        </div>
      </div>
    );
  }

  // Vista normal para usuarios
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 md:py-24">
        <h1 className="text-2xl font-bold mb-4">Mi Agenda</h1>

        {reservas.length === 0 ? (
          <p className="text-gray-500">No tienes sesiones reservadas.</p>
        ) : (
          <ul className="space-y-3">
            {reservas.map((reserva) => (
              <li
  key={reserva.id}
  className="flex items-center justify-between px-4 py-3 rounded-lg border bg-white"
>
  <div className="flex-1">
    <div className="flex items-center gap-2 mb-1">
      <span className="font-medium">{reserva.horario.dia}</span> - 
      <span>{reserva.horario.hora}</span>
      <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
        {reserva.horario.tipo}
      </span>
    </div>
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-500">
        {new Date(reserva.fechaReal).toLocaleDateString()}
      </span>
      <span className="text-sm text-gray-600">
        Participantes: {reserva.horario._count?.reservas || 0} 
      </span>
    </div>
  </div>
  
  {/* Botón de cancelación */}
  <form
    action={cancelarReserva.bind(null, reserva.horarioId, reserva.horario.tipo)}
    className="ml-4"
  >
    <button
      type="submit"
      className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
    >
      Cancelar
    </button>
  </form>
</li>
            ))}
          </ul>
        )}
      </main>

     <div className="mt-12">
          <Footer />
        </div>
    </div>
  );
}