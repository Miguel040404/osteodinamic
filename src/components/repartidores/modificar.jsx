'use client'
import { PencilIcon, RefreshCwIcon } from "lucide-react";
import { useActionState, useEffect, useId } from "react";
import { toast } from "sonner";
import { modificarRepartidor } from "@/lib/actions";



function RepartidorModificar({ repartidor }) {
    const formId = useId()

    const [state, action, pending] = useActionState(modificarRepartidor, {})

    useEffect(() => {
        if (state.success) {
            toast.success(state.success)
            document.getElementById(formId)?.closest('dialog')?.close()
        }
    }, [state])

    return (
        <form id={formId} className="flex flex-col gap-4" action={action}>

            <button type="submit" disabled={pending}
                className='self-end mb-4 font-bold bg-amber-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-amber-700 hover:text-gray-100 disabled:bg-zinc-400'
            >
                {pending
                    ? <div><RefreshCwIcon className='inline animate-spin' /> Actualizando...</div>
                    : <div><PencilIcon className='inline' /> Actualizar </div>
                }
            </button>

            <input type="hidden" name="id" defaultValue={repartidor.id} />

            <label>Nombre:
                <input name='nombre' defaultValue={repartidor.nombre} />
            </label>

            <label>Teléfono:
                <input name='telefono' defaultValue={repartidor.telefono} />
            </label>

        </form>
    );
}

export default RepartidorModificar;