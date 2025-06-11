import EditarPerfilButton from "../EditarPerfilButton";
import { PerfilHeader } from "./PerfilHeader";


export const PerfilCard = ({ user }) => (
  <section className="max-w-3xl mx-auto bg-white rounded-2xl p-6 sm:p-10 mb-10 border border-[#b9b59c]">
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <img
        src={user?.image || "/images/avatar-80.png"}
        alt="Imagen de usuario"
        className="w-36 h-36 rounded-full object-cover border-4 border-[#e8d7c3]"
      />
      <div className="flex-1 space-y-3 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <PerfilHeader user={user} />
          <EditarPerfilButton user={user} />
        </div>
        <p className="text-[#4d4037]">
          Dirección: <span className="font-semibold text-[#a57551]">{user.address}</span>
        </p>
        <p className="text-[#4d4037]">
          Teléfono: <span className="font-semibold text-[#a57551]">{user.phone}</span>
        </p>
        <span className="inline-block mt-2 px-3 py-1 text-sm font-medium bg-[#e8d7c3] text-[#4d4037] rounded-full shadow-sm">
          Rol: {user.role}
        </span>
      </div>
    </div>
  </section>
);