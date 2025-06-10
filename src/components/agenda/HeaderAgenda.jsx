export const HeaderAgenda = ({ esAdmin }) => (
  <div className="mb-10 text-center">
    <h1 className="text-3xl md:text-4xl font-bold text-[#4d4037] mb-2">
      {esAdmin ? "Panel de Administración" : "Mi Agenda"}
    </h1>
    <p className="text-[#a57551] max-w-2xl mx-auto">
      {esAdmin ? "Administra todas las reservas y horarios del sistema" : "Revisa y gestiona tus próximas sesiones programadas"}
    </p>
  </div>
);
