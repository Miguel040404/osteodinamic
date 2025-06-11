import { CrearHorarioModal } from "./HorarioModals";


export const HorarioHeader = ({ tipo, esAdmin }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-[#4d4037] capitalize">
        {tipo === 'Pilates' ? 'Pilates terapéutico' :
          tipo === 'Rehabilitacion_funcional' ? 'Rehabilitación funcional' :
            tipo === 'Entrenamiento_personal' ? 'Salud activa personal' :
              tipo.replace(/_/g, ' ')}
      </h1>
    </div>
    {esAdmin && <CrearHorarioModal tipo={tipo} />}
  </div>
);