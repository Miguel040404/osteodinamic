import { Users, ChevronDown, XCircle } from 'lucide-react';
import { cancelarReservaAdmin } from "@/lib/actions";

export const HorarioUsersList = ({ horario, tipo }) => (
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
                <form action={cancelarReservaAdmin.bind(null, horario.id, tipo, r.userId)}>
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
);