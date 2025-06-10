import { Clock } from 'lucide-react';
import { HorarioActions } from './HorarioAction';
import { HorarioUsersList } from './HorarioUserList';


export const HorarioItem = ({ horario, userId, esAdmin, tipo }) => {
  const yaApuntado = horario.reservas.some((r) => r.userId === userId);
  const plazasOcupadas = horario.reservas.length;
  const plazasTotales = 6;
  const lleno = plazasOcupadas === plazasTotales;
  const pocasPlazas = plazasOcupadas >= 4 && plazasOcupadas < plazasTotales;

  return (
    <div className="p-6">
      <div className="flex justify-between items-start">
        <div className="flex flex-row-reverse gap-4 sm:gap-6">
          <span className={`inline-flex items-center px-5 py-1 h-8 rounded-full text-xs font-medium ${
            horario.sala === 'Sala 1'
              ? 'bg-amber-100 text-amber-800 border border-amber-500'
              : 'bg-[#fac156] text-[#913b02] border border-[#823400]'
          }`}>
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
        <div className="flex flex-col items-end gap-2">
          <span className={`text-sm font-semibold ${
            lleno ? 'text-red-600' : pocasPlazas ? 'text-amber-600' : 'text-green-600'
          }`}>
            {plazasOcupadas} / {plazasTotales} plazas
          </span>
          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                lleno ? 'bg-red-500' : pocasPlazas ? 'bg-amber-500' : 'bg-green-500'
              }`}
              style={{ width: `${(plazasOcupadas / plazasTotales) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      <HorarioActions
        horario={horario}
        esAdmin={esAdmin}
        tipo={tipo}
        yaApuntado={yaApuntado}
        lleno={lleno}
      />
      {esAdmin && horario.reservas.length > 0 && (
        <HorarioUsersList horario={horario} tipo={tipo} />
      )}
    </div>
  );
};