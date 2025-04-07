'use client'
import { eliminarPedido } from "@/lib/actions";
import { RefreshCwIcon, TrashIcon } from "lucide-react";
import { useActionState, useEffect, useId } from "react";
import { toast } from "sonner";



function PedidoEliminar({ pedido }) {

    const formId = useId()

    const [state, action, pending] = useActionState(eliminarPedido, {})

    useEffect(() => {
        if (state.success) {
            toast.success(state.success)
            document.getElementById(formId)?.closest('dialog')?.close()
        }
    }, [state])

    return (
        <div className="flex flex-col gap-4">
            <form id={formId} action={action} className="w-full flex flex-col px-4">
                <input type="hidden" name="id" defaultValue={pedido.id} />

                <button type="submit" disabled={pending}
                    className='self-end mb-4 font-bold bg-red-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-red-700 hover:text-gray-100 disabled:bg-zinc-400'
                >
                    {pending
                        ? <div><RefreshCwIcon className='inline animate-spin' /> Eliminando...</div>
                        : <div><TrashIcon className='inline' /> Eliminar </div>
                    }
                </button>
            </form>

            <p>FECHA Y HORA: {new Date(pedido.fecha_hora).toLocaleString()}</p>
            <p>NOMBRE CLIENTE: {pedido.nombre_cliente}</p>
            <p>DIRECCIÓN CLIENTE: {pedido.direccion_cliente}</p>

        </div>
    );
}

export default PedidoEliminar;