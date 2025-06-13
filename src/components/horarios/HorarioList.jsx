import { auth } from "@/auth";
import { HorarioDay } from "./HorarioDay";
import { HorarioHeader } from "./HorarioHeader";
import { getHorariosConReservasPorTipo } from "@/lib/data";
import prisma from "@/lib/prisma";


const getDiaNombre = (dia) => {
  const dias = {
    'MONDAY': 'Lunes',
    'TUESDAY': 'Martes',
    'WEDNESDAY': 'Miércoles',
    'THURSDAY': 'Jueves',
    'FRIDAY': 'Viernes',
  };
  return dias[dia.toUpperCase()] || dia;
};

const ordenarHorarios = (horarios) => {
  const diasOrden = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  
  return horarios.sort((a, b) => {
    const diaA = diasOrden.indexOf(getDiaNombre(a.dia));
    const diaB = diasOrden.indexOf(getDiaNombre(b.dia));
    if (diaA !== diaB) return diaA - diaB;
    const horaA = parseInt(a.hora.replace(':', ''));
    const horaB = parseInt(b.hora.replace(':', ''));
    if (horaA !== horaB) return horaA - horaB;
    const salaNumA = parseInt(a.sala.split(' ')[1]);
    const salaNumB = parseInt(b.sala.split(' ')[1]);
    return salaNumA - salaNumB;
  });
};

export default async function ListaHorarios({ tipo }) {
  const session = await auth();
  const userId = session?.user?.id;
  const esAdmin = session?.user?.role === "ADMIN";
  const horarios = await getHorariosConReservasPorTipo(tipo);
  const horariosOrdenados = ordenarHorarios(horarios);

  // Obtener todas las reservas del usuario con sus horarios
  let reservasUsuario = [];
  if (userId) {
    reservasUsuario = await prisma.reserva.findMany({
      where: { userId },
      include: { horario: true },
    });
  }

  const horariosPorDia = {};
  horariosOrdenados.forEach(horario => {
    const dia = getDiaNombre(horario.dia);
    if (!horariosPorDia[dia]) {
      horariosPorDia[dia] = [];
    }
    horariosPorDia[dia].push(horario);
  });

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  return (
    <div className="w-full max-w-4xl mx-auto py-2 px-1">
      <HorarioHeader tipo={tipo} esAdmin={esAdmin} />
      <div className="space-y-8">
        {dias.map((dia, index) => (
          <HorarioDay
            key={index}
            dia={dia}
            horariosDelDia={horariosPorDia[dia] || []}
            userId={userId}
            esAdmin={esAdmin}
            tipo={tipo}
            reservasUsuario={reservasUsuario} // Nuevo prop
          />
        ))}
      </div>
    </div>
  );
}