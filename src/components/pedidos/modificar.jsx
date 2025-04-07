'use client'
import { modificarPedido } from "@/lib/actions";
import { PencilIcon, PenIcon, PlusIcon, RefreshCwIcon } from "lucide-react";
import { useActionState, useEffect, useId } from "react";
import { toast } from "sonner";

function PedidoModificar({ pedido, repartidores, pizzas }) {
    const formId = useId()

    const [state, action, pending] = useActionState(modificarPedido, {})

    useEffect(() => {
        if (state.success) {
            toast.success(state.success)
            document.getElementById(formId)?.closest('dialog')?.close()
        }
    }, [state])

    const IDs = pedido.pizzas.map(p => p.id)

    return (
        <form id={formId} action={action} className="flex flex-col gap-4" >
            <input type="hidden" name="id" defaultValue={pedido.id} />

            <button type="submit" disabled={pending}
                className='self-end mb-4 font-bold bg-amber-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-amber-700 hover:text-gray-100 disabled:bg-zinc-400'
            >
                {pending
                    ? <div><RefreshCwIcon className='inline animate-spin' /> Actualizando...</div>
                    : <div><PencilIcon className='inline' /> Actualizar </div>
                }
            </button>

            <label> Fecha y hora:
                <input name="fecha_hora" type="datetime-local" defaultValue={new Date(pedido.fecha_hora).toISOString().split('Z')[0]} />
            </label>

            <label> Nombre del cliente:
                <input name="nombre_cliente" placeholder="Nombre cliente" defaultValue={pedido.nombre_cliente} />
            </label>

            <label> Nombre del cliente:
                <input name="direccion_cliente" placeholder="Dirección cliente" defaultValue={pedido.direccion_cliente} />
            </label>

            <p className="font-bold">Repartidor</p>
            <select name="repartidorId" defaultValue={pedido.repartidorId} key={pedido.repartidorId}>
                {
                    repartidores.map(repartidor =>
                        <option key={repartidor.id} value={repartidor.id}>
                            {repartidor.nombre}
                        </option>
                    )
                }
            </select>


            <p className="font-bold">Pizzas</p>
            {
                pizzas.map(pizza =>
                    <label key={pizza.id}>
                        <input
                            type="checkbox"
                            name={`pizza${pizza.id}`}
                            value={pizza.id}
                            defaultChecked={IDs.includes(pizza.id)}
                        />

                        {pizza.nombre}

                    </label>
                )
            }

        </form>
    );
}

export default PedidoModificar;