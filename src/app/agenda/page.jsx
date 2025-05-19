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
import { getReservasDelUsuario } from "@/lib/actions";
import { auth } from "@/auth";

export default async function AgendaPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const reservas = await getReservasDelUsuario(userId);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
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
                <div>
                  <span className="font-medium">{reserva.horario.dia}</span> -{" "}
                  <span>{reserva.horario.hora}</span>
                </div>
                <span className="text-sm text-gray-500">{new Date(reserva.fechaReal).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </main>

      <Footer />
    </div>
  );
}
