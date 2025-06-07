import { TrashIcon, PencilIcon, PlusIcon } from "lucide-react";
import { auth } from "@/auth";
import Modal from "@/components/modal";
import UserVer from "@/components/users/ver";
import UserEliminar from "@/components/users/eliminar";
import { getUsers } from "@/lib/data";
import RegisterForm from "../auth/register-form";
import UserModificar from "../auth/edit-form";

async function Users() {
  const session = await auth();
  const users = await getUsers();

  const filteredUsers = users.filter(user => user.id !== session.user.id);

  const sortedUsers = filteredUsers.sort((a, b) => {
    if (a.role === b.role) return a.name.localeCompare(b.name);
    return a.role === "ADMIN" ? -1 : 1;
  });

  const admins = sortedUsers.filter(user => user.role === "ADMIN");
  const regularUsers = sortedUsers.filter(user => user.role !== "ADMIN");

  const renderUserRow = (user) => (
    <div
      key={user.id}
      className="px-4 py-3 flex justify-between items-center border-b last:border-none bg-[#f9faf5] hover:bg-[#e8d7c3] transition"
    >
      <Modal
        title="Ver perfil"
        openElement={
          <span className="font-medium text-[#a57551] hover:underline cursor-pointer">
            {user.name}
          </span>
        }
      >
        <UserVer user={user} />
      </Modal>

      {session?.user?.role === "ADMIN" && (
        <div className="flex gap-2">
          <Modal
            title={`Editar perfil de ${user.name}`}
            openElement={
              <button className="w-8 h-8 grid place-content-center rounded-full bg-[#ddab7196] text-[#4d4037] border border-[#b9b59c] hover:bg-[#a57551] hover:text-white transition cursor-pointer">
                <PencilIcon className="w-4 h-4" />
              </button>
            }
          >
            <UserModificar user={user} sessionUser={session.user} />
          </Modal>

          <Modal
            title={`Eliminar perfil de ${user.name}`}
            openElement={
              <button className="w-8 h-8 grid place-content-center rounded-full bg-red-100 text-red-700 border border-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer">
                <TrashIcon className="w-4 h-4" />
              </button>
            }
          >
            <UserEliminar user={user} />
          </Modal>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 mt-6">
      {/* Botón añadir usuario */}
      <div className="flex justify-end">
        <Modal
          title="Crear perfil de usuario"
          openElement={
            <button className="flex items-center gap-2 bg-[#a57551] hover:bg-[#8f6043] text-white px-4 py-2.5 rounded-lg transition shadow-sm hover:shadow-md cursor-pointer">
              <PlusIcon className="w-4 h-4" />
              Añadir usuario
            </button>
          }
        >
          <RegisterForm />
        </Modal>
      </div>

      {/* Administradores */}
      {admins.length > 0 && (
        <details open className="border border-[#b9b59c] bg-[#f9faf5]">
          <summary className="bg-[#998063d0] px-4 py-2 font-semibold text-[#4d4037] cursor-pointer select-none">
            Administradores
          </summary>
          {admins.map(renderUserRow)}
        </details>
      )}

      {/* Usuarios */}
      {regularUsers.length > 0 && (
        <details open className="border border-[#b9b59c] bg-[#f9faf5]">
          <summary className="bg-[#998063d0] px-4 py-2 font-semibold text-[#4d4037] cursor-pointer select-none">
            Usuarios
          </summary>
          {regularUsers.map(renderUserRow)}
        </details>
      )}
    </div>
  );
}

export default Users;



// import { TrashIcon, PencilIcon, PlusIcon } from "lucide-react";
// import { auth } from "@/auth"
// import Modal from '@/components/modal';
// import UserVer from '@/components/users/ver'
// import UserModificar from '@/components/users/modificar';
// import UserEliminar from '@/components/users/eliminar';
// import { getUsers } from "@/lib/data";
// import UserInsertar from "./insertar";
// import RegisterForm from "../auth/register-form";

// async function Users() {
//     const session = await auth()
//     const users = await getUsers()


//     return (
//         <div>
//             <Modal openElement={
//                 <div className='justify-self-end mb-2 mr-1 size-8 grid place-content-center rounded-full border border-green-500 text-green-700 bg-green-200 hover:bg-green-500 hover:text-white hover:cursor-pointer'>
//                     <PlusIcon className='size-4' />
//                 </div>}>
//                 <RegisterForm />
//             </Modal>

//             {users
//                 .filter(user => user.id !== session.user.id)
//                 .map(user => (
//                     <div key={user.id} className="p-1 flex justify-between items-center odd:bg-slate-100">

//                         <Modal openElement={<p className="cursor-pointer">{user.name}</p>}>
//                             <UserVer user={user} />
//                         </Modal>


//                         {session?.user?.role === 'ADMIN' &&
//                             <div className='flex justify-center items-center gap-1'>

//                                 <Modal openElement={
//                                     <div className='size-8 grid place-content-center rounded-full border border-amber-500 text-amber-700 bg-amber-200 hover:bg-amber-500 hover:text-white hover:cursor-pointer'>
//                                         <PencilIcon className='size-4' />
//                                     </div>}>
//                                     <UserModificar user={user} sessionUser={session.user} />
//                                 </Modal>

//                                 <Modal openElement={
//                                     <div className='size-8 grid place-content-center rounded-full border border-red-500 text-red-700 bg-red-200 hover:bg-red-500 hover:text-white hover:cursor-pointer'>
//                                         <TrashIcon className='size-4' />
//                                     </div>}>
//                                     <UserEliminar user={user} />
//                                 </Modal>
//                             </div>
//                         }
//                     </div>
//                 ))}
//         </div>

//     )
// }

// export default Users