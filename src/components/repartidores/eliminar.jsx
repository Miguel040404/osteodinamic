'use client'
import { RefreshCwIcon, TrashIcon } from "lucide-react";
import { useActionState, useEffect, useId } from "react";
import { toast } from "sonner";
import { eliminarRepartidor } from "@/lib/actions";


function RepartidorEliminar({ repartidor }) {
    const formId = useId()

    const [state, action, pending] = useActionState(eliminarRepartidor, {})

    useEffect(() => {
        if (state.success) {
            toast.success(state.success)
            document.getElementById(formId)?.closest('dialog')?.close()
        }
    }, [state])

    return (
        <div className="flex flex-col gap-4">
            <form id={formId} action={action} className="w-full flex flex-col px-4">
                <input type="hidden" name="id" defaultValue={repartidor.id} />

                <button type="submit" disabled={pending}
                    className='self-end mb-4 font-bold bg-red-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-red-700 hover:text-gray-100 disabled:bg-zinc-400'
                >
                    {pending
                        ? <div><RefreshCwIcon className='inline animate-spin' /> Eliminando...</div>
                        : <div><TrashIcon className='inline' /> Eliminar </div>
                    }
                </button>
            </form>
            <p>REPARTIDOR: {repartidor.nombre}</p>
            <p>TELÉFONO: {repartidor.telefono}</p>

        </div>
    );
}

export default RepartidorEliminar;