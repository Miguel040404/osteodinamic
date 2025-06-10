import Users from "../users/lista";


export const UsersList = () => (
  <section className="max-w-3xl mx-auto mb-10 border border-[#b9b59c]">
    <details className="bg-white rounded-lg p-4">
      <summary className="!text-[#4d4037] text-lg font-semibold cursor-pointer">Lista de usuarios</summary>
      <div className="mt-4">
        <Users />
      </div>
    </details>
  </section>
);
