export const ordenDias = {
  Lunes: 1,
  Martes: 2,
  Miércoles: 3,
  Jueves: 4,
  Viernes: 5,
};

export const diasSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];

export function getProximaFecha(dia, hora) {
  const hoy = new Date();
  const diaActual = hoy.getDay();
  const diaObjetivo = diasSemana.indexOf(dia) + 1;

  let diferenciaDias = diaObjetivo - diaActual;
  if (diferenciaDias < 0 || (diferenciaDias === 0 && horaPasada(hora))) {
    diferenciaDias += 7;
  }

  const proxima = new Date(hoy);
  proxima.setDate(hoy.getDate() + diferenciaDias);
  return proxima.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  });
}

function horaPasada(hora) {
  const [h, m] = hora.split(":").map(Number);
  const ahora = new Date();
  return ahora.getHours() > h || (ahora.getHours() === h && ahora.getMinutes() > m);
}