"use client";

import { XCircle, Plus } from "lucide-react";
import { apuntarseAHorario, cancelarReserva } from "@/lib/actions";
import { EditarHorarioModal, EliminarHorarioModal } from "./HorarioModals";

export const HorarioActions = ({
  horario,
  esAdmin,
  tipo,
  yaApuntado,
  lleno,
  bloqueado,
}) => {
  const estado = yaApuntado
    ? "apuntado"
    : lleno
    ? "completo"
    : bloqueado
    ? "ocupado"
    : "disponible";

  const textos = {
    apuntado: {
      texto: "Cancelar reserva",
      icono: <XCircle className="w-5 h-5" />,
      estilos:
        "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200",
    },
    completo: {
      texto: "Lleno",
      icono: null,
      estilos:
        "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200",
    },
    ocupado: {
      texto: "Reservado en otra sala",
      icono: null,
      estilos:
        "bg-amber-100 text-amber-700 cursor-not-allowed border border-amber-200",
    },
    disponible: {
      texto: "Reservar ahora",
      icono: <Plus className="w-5 h-5" />,
      estilos:
        "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border border-indigo-200",
    },
  };

  const { texto, icono, estilos } = textos[estado];
  const deshabilitado = estado !== "disponible" && estado !== "apuntado";

  return (
    <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:ml-auto sm:justify-end gap-3 mt-5">
      <div className="w-full flex justify-between items-center flex-wrap gap-3">
        <div className="w-full flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="w-full flex flex-col md:flex-col gap-4">
            <div className="flex justify-end gap-4">
              {esAdmin ? (
                <>
                  <EditarHorarioModal horario={horario} />
                  <EliminarHorarioModal horarioId={horario.id} />
                </>
              ) : (
                <form
                  action={(
                    yaApuntado ? cancelarReserva : apuntarseAHorario
                  ).bind(null, horario.id, tipo)}
                >
                  <button
                    type="submit"
                    disabled={deshabilitado}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${estilos} ${
                      deshabilitado ? "opacity-80" : "hover:scale-[1.02]"
                    }`}
                  >
                    {icono}
                    <span>{texto}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// import { XCircle, Plus } from 'lucide-react';
// import { apuntarseAHorario, cancelarReserva } from "@/lib/actions";
// import { EditarHorarioModal, EliminarHorarioModal } from './HorarioModals';


// export const HorarioActions = ({ horario, esAdmin, tipo, yaApuntado, lleno }) => (
//   <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:ml-auto sm:justify-end gap-3 mt-5">
//     <div className="w-full flex justify-between items-center flex-wrap gap-3">
//       <div className="w-full flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
//         <div className="w-full flex flex-col md:flex-col gap-4">
//           <div className="flex justify-end gap-4">
//             {esAdmin ? (
//               <>
//                 <EditarHorarioModal horario={horario} />
//                 <EliminarHorarioModal horarioId={horario.id} />
//               </>
//             ) : (
//               <form action={(yaApuntado ? cancelarReserva : apuntarseAHorario).bind(null, horario.id, tipo)}>
//                 <button
//                   type="submit"
//                   className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${yaApuntado
//                       ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
//                       : lleno
//                         ? 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'
//                         : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border border-indigo-200'
//                     }`}
//                   disabled={lleno || (!yaApuntado && lleno)}
//                 >
//                   {yaApuntado ? (
//                     <>
//                       <XCircle className="w-5 h-5" />
//                       <span>Cancelar reserva</span>
//                     </>
//                   ) : lleno ? (
//                     <span>Lleno</span>
//                   ) : (
//                     <>
//                       <Plus className="w-5 h-5" />
//                       <span>Reservar ahora</span>
//                     </>
//                   )}
//                 </button>
//               </form>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );