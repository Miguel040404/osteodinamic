'use client'
import { insertarPedido } from "@/lib/actions";
import { PlusIcon, RefreshCwIcon } from "lucide-react";
import { useActionState, useEffect, useId } from "react";
import { toast } from "sonner";


function PedidoInsertar({ repartidores, pizzas }) {

    const formId = useId()

    const [state, action, pending] = useActionState(insertarPedido, {})

    useEffect(() => {
        if (state.success) {
            toast.success(state.success)
            document.getElementById(formId)?.closest('dialog')?.close()
        }
    }, [state])

    return (
        <form id={formId} action={action} className="flex flex-col gap-4">
            <button type="submit" disabled={pending}
                className='self-end mb-4 font-bold bg-green-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-700 hover:text-gray-100 disabled:bg-zinc-400'
            >
                {pending
                    ? <div><RefreshCwIcon className='inline animate-spin' /> Guardando...</div>
                    : <div><PlusIcon className='inline' /> Guardar </div>
                }
            </button>

            <label> Fecha y hora:
                <input name="fecha_hora" type="datetime-local" defaultValue={new Date().toISOString().split('Z')[0]} />
            </label>

            <label> Nombre del cliente:
                <input name="nombre_cliente" placeholder="Nombre cliente" />
            </label>

            <label> Dirección del cliente:
                <input name="direccion_cliente" placeholder="Dirección cliente" />
            </label>

            <p className="font-bold">Repartidor</p>
            <select name="repartidorId">
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
                            name={`pizza${pizza.id}`} />

                        {pizza.nombre}

                    </label>
                )
            }

        </form>

    );
}

export default PedidoInsertar;