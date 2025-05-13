'use client';

import { useState, useEffect } from 'react';
import { getHorariosConReservasPorTipo } from '@/lib/data';
import Main from '@/components/main';

export default function ClasePage({ params }) {
  const [horariosPorDia, setHorariosPorDia] = useState(null);
  const [tipo, setTipo] = useState('');

 useEffect(() => {
  console.log('Params:', params);
  const tipo = params.tipo || '';
  console.log('Tipo:', tipo);
  setTipo(tipo);

  if (tipo) {
    // Asegurarse de que los horarios se obtienen correctamente
    getHorariosConReservasPorTipo(tipo)
      .then((horarios) => {
        console.log('Horarios obtenidos:', horarios);
        setHorariosPorDia(horarios);
      })
      .catch((error) => {
        console.error('Error obteniendo horarios:', error);
      });
  }
}, [params]);

if (!horariosPorDia) {
  console.log('Horarios por día:', horariosPorDia);
  return <div>Cargando...</div>; // O un spinner mientras se carga
}

return <Main horariosPorDia={horariosPorDia} tipo={tipo} />;
}
