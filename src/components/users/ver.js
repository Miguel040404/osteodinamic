function UserVer({ user }) {
  return (
    // <div className="p-6 rounded-lg bg-white shadow-md max-w-md mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-[100px_auto] gap-4 items-center justify-center">
        {/* Imagen del usuario */}
        <div className="flex justify-center">
          <img
            src={user.image || '/images/avatar-80.png'}
            alt="Imagen de usuario"
            className="w-24 h-24 rounded-full border object-cover shadow-sm"
          />
        </div>

        {/* Datos del usuario */}
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-semibold text-gray-800">{user.name}</h1>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Teléfono:</span> {user.phone || "No disponible"}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Dirección:</span> {user.address || "No disponible"}
          </p>
        </div>
      </div>
  );
}

export default UserVer;