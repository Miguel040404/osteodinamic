'use client'
import { deleteUser } from "@/lib/actions";
import { RefreshCwIcon, TrashIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";   // IMPORTANTE: No importar desde next/router
import { useActionState, useEffect, useId } from "react";
import { toast } from "sonner";



function UserEliminar({ user }) {
    const formId = useId()
    const [state, action, pending] = useActionState(deleteUser, {})
    const { refresh } = useRouter()


    useEffect(() => {
        if (state?.success) {
            toast.success(state.success)
            document.getElementById(formId).closest('dialog')?.close() // Si el padre es un dialog, lo cerramos
            refresh()  // refrescamos página despues de mostrar toast
        }
        if (state?.error) toast.error(state.error)

    }, [formId, state])



    return (
        <div>
            <form id={formId} action={action} className="w-full flex flex-col px-4">
                <input type="hidden" name="id" defaultValue={user.id} />

                <button type="submit" disabled={pending}
                    className='self-end mb-4 font-bold bg-red-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-red-700 hover:text-gray-100 disabled:bg-zinc-400'
                >
                    {pending
                        ? <div><RefreshCwIcon className='inline animate-spin' /> Eliminando...</div>
                        : <div><TrashIcon className='inline' /> Eliminar</div>
                    }
                </button>
            </form>
            <div className="grid md:grid-cols-[80px_auto]">
                {/* {user.image
                    ? <img src={user.image} alt="Imagen de usuario" width={64} />
                    : <UserIcon className="size-16" />
                } */}
                                {/* <img src={user.image || '/images/avatar-80.png'} alt="Imagen de usuario" width={192} /> */}
                                <img src={user.image || '../../../public/images/avatar-80.png'} alt="Imagen de usuario" width={192} />


                <div>
                    <h1 className="text-xl">{user.name}</h1>
                    <p className="text-xs text-gray-500">phone: {user.phone}</p>
                </div>
            </div>

        </div>
    );
}

export default UserEliminar;