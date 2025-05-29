import { TrashIcon, PencilIcon, PlusIcon } from "lucide-react";
import { auth } from "@/auth"
import Modal from '@/components/modal';
import UserVer from '@/components/users/ver'
import UserModificar from '@/components/users/modificar';
import UserEliminar from '@/components/users/eliminar';
import { getUsers } from "@/lib/data";
import UserInsertar from "./insertar";
import RegisterForm from "../auth/register-form";

async function Users() {
    const session = await auth()
    const users = await getUsers()

    return (
        <div>
            <Modal openElement={
                <div className='justify-self-end mb-2 mr-1 size-8 grid place-content-center rounded-full border border-green-500 text-green-700 bg-green-200 hover:bg-green-500 hover:text-white hover:cursor-pointer'>
                    <PlusIcon className='size-4' />
                </div>}>
                <RegisterForm />
            </Modal>

            {users
                .filter(user => user.id !== session.user.id)
                .map(user => (
                    <div key={user.id} className="p-1 flex justify-between items-center odd:bg-slate-100">

                        <Modal openElement={<p className="cursor-pointer">{user.name}</p>}>
                            <UserVer user={user} />
                        </Modal>


                        {session?.user?.role === 'ADMIN' &&
                            <div className='flex justify-center items-center gap-1'>

                                <Modal openElement={
                                    <div className='size-8 grid place-content-center rounded-full border border-amber-500 text-amber-700 bg-amber-200 hover:bg-amber-500 hover:text-white hover:cursor-pointer'>
                                        <PencilIcon className='size-4' />
                                    </div>}>
                                    <UserModificar user={user} sessionUser={session.user} />
                                </Modal>

                                <Modal openElement={
                                    <div className='size-8 grid place-content-center rounded-full border border-red-500 text-red-700 bg-red-200 hover:bg-red-500 hover:text-white hover:cursor-pointer'>
                                        <TrashIcon className='size-4' />
                                    </div>}>
                                    <UserEliminar user={user} />
                                </Modal>
                            </div>
                        }
                    </div>
                ))}
        </div>

    )
}

export default Users