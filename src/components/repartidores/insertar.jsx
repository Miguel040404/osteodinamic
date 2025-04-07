'use client'
import { PlusIcon, RefreshCwIcon } from "lucide-react";
import { useActionState, useEffect, useId } from "react";
import { toast } from "sonner";
import { insertarRepartidor } from "@/lib/actions";


function RepartidorInsertar() {
    const formId = useId()

    const [state, action, pending] = useActionState(insertarRepartidor, {})

    useEffect(() => {
        if (state.success) {
            toast.success(state.success)
            document.getElementById(formId)?.closest('dialog')?.close()
        }
    }, [state])


    return (
        <form id={formId} className="flex flex-col gap-4" action={action}>
            <button type="submit" disabled={pending}
                className='self-end mb-4 font-bold bg-green-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-700 hover:text-gray-100 disabled:bg-zinc-400'
            >
                {pending
                    ? <div><RefreshCwIcon className='inline animate-spin' /> Guardando...</div>
                    : <div><PlusIcon className='inline' /> Guardar </div>
                }
            </button>

            <label>Nombre:
                <input name='nombre' placeholder="Nombre" required />
            </label>

            <label>Teléfono:
                <input name='telefono' placeholder="Teléfono" />
            </label>

        </form>

    );
}

export default RepartidorInsertar;