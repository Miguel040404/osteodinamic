function UserVer({ user }) {
  const paidSessions = Array.isArray(user.paidSessions) ? user.paidSessions : [];


  return (
    <div className="p-6 rounded-2xl bg-[#fdfaf6] border border-[#e4d6c3] shadow-lg w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-[150px_auto] gap-6 items-center">
        {/* Imagen del usuario */}
        <div className="flex justify-center md:justify-start">
          <img
            src={user.image || '/images/avatar-80.png'}
            alt="Imagen de usuario"
            className="w-28 h-28 rounded-full border-4 border-[#d2b48c] object-cover shadow-sm"
          />
        </div>

        {/* Datos del usuario */}
        <div className="space-y-3 text-center md:text-left">
          <h1 className="text-2xl font-semibold text-[#5C4033]">{user.name}</h1>
          <p className="text-sm text-[#6B4F3B]">
            <span className="font-medium text-black">Teléfono:</span>{" "}
            {user.phone || "No disponible"}
          </p>
          <p className="text-sm text-[#6B4F3B]">
            <span className="font-medium text-black">Dirección:</span>{" "}
            {user.address || "No disponible"}
          </p>
        </div>
      </div>

      {/* Sesiones pagadas */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-[#5C4033] mb-4">Sesiones pagadas</h2>
        {paidSessions.length > 0 ? (
          <ul className="list-disc list-inside space-y-2 text-[#6B4F3B]">
            {paidSessions.map((sessionObj, index) => {
              const type = sessionObj.sessionType;

              let label = type;
              if (type === "Pilates") label = "Pilates terapéutico";
              else if (type === "Rehabilitacion_funcional") label = "Rehabilitación Funcional";
              else if (type === "Entrenamiento_personal") label = "Salud activa personal";

              return <li key={index} className="text-sm">{label}</li>;
            })}
          </ul>

        ) : (
          <p className="text-sm text-gray-500 italic">No tiene sesiones asignadas.</p>
        )}
      </div>
    </div>
  );
}

export default UserVer;