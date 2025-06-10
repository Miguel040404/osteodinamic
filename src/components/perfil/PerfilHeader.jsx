export const PerfilHeader = ({ user }) => (
  <div className="flex items-center justify-center sm:justify-start gap-2">
    <h2 className="text-[#4d4037] text-2xl font-bold">{user.name}</h2>
  </div>
);
