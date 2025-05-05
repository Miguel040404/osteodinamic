// esto es la agenda mensual calendario

'use client';
import React, { useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';

const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function AgendaMensual() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = hoy.getMonth(); // 0-11

    const primerDia = new Date(año, mes, 1).getDay(); // día de la semana del 1° del mes
    const diasEnMes = new Date(año, mes + 1, 0).getDate(); // días en el mes

    const [diasMarcados, setDiasMarcados] = useState({});

    const toggleDia = (dia) => {
        setDiasMarcados((prev) => ({
            ...prev,
            [dia]: !prev[dia],
        }));
    };

    const dias = [];
    for (let i = 0; i < primerDia; i++) {
        dias.push(null); // relleno antes del primer día
    }
    for (let i = 1; i <= diasEnMes; i++) {
        dias.push(i);
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Agenda - {hoy.toLocaleString('es-ES', { month: 'long' })} {año}
                </h1>

                <div className="grid grid-cols-7 gap-2 text-center text-sm sm:text-base">
                    {diasSemana.map((dia, index) => (
                        <div key={index} className="font-semibold text-gray-700">
                            {dia}
                        </div>
                    ))}

                    {dias.map((dia, index) => (
                        <div
                            key={index}
                            onClick={() => dia && toggleDia(dia)}
                            className={`h-10 sm:h-14 border rounded-xl flex items-center justify-center cursor-pointer select-none transition 
                                ${dia ? 'bg-white hover:bg-blue-100' : ''} 
                                ${diasMarcados[dia] ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                        >
                            {dia || ''}
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default AgendaMensual;

// ejemplo de como debe de quedar la agenda 

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
