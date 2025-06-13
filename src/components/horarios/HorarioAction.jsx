"use client";

import { XCircle, Plus, LoaderCircle } from "lucide-react";
import { apuntarseAHorario, cancelarReservaForm } from "@/lib/actions";
import { EditarHorarioModal, EliminarHorarioModal } from "./HorarioModals";
import { useActionState } from "react";


export const HorarioActions = ({
  horario,
  esAdmin,
  tipo,
  yaApuntado,
  lleno,
  bloqueado,
}) => {

    const [stateApuntarse, actionApuntarse, pendingApuntarse] = useActionState(apuntarseAHorario, {});
    const [stateNoApuntarse, actionNoApuntarse, pendingNoApuntarse] = useActionState(cancelarReservaForm, {});
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
                  action={
                    yaApuntado ? actionNoApuntarse : actionApuntarse
                  }
                >
                  <input type="hidden" name="tipo" value={tipo}  />
                  <input type="hidden" name="horarioId" value={horario.id}  />
                  <button
                    type="submit"
                    disabled={pendingApuntarse || pendingNoApuntarse || deshabilitado}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${estilos} ${
                      pendingApuntarse || pendingNoApuntarse|| deshabilitado ? "opacity-80" : "hover:scale-[1.02]"
                    }`}
                  >
                  { pendingApuntarse || pendingNoApuntarse ?  <LoaderCircle className="w-5 h-5 animate-spin" /> :icono }
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