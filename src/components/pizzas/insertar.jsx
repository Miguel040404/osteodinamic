'use client'
import { insertarPizza } from "@/lib/actions";
import { PlusIcon, RefreshCwIcon } from "lucide-react";
import { useActionState, useEffect, useId } from "react";
import { toast } from "sonner";
import InputImage from "../input-image";


function PizzaInsertar() {
    const formId = useId()

    const [state, action, pending] = useActionState(insertarPizza, {})

    useEffect(() => {
        if (state.success) {
            toast.success(state.success)
            document.getElementById(formId)?.closest('dialog')?.close()
        }
    }, [state])

    return (
        <form id={formId} className="@container flex flex-col gap-4" action={action}>
            <button type="submit" disabled={pending}
                className='text-md my-4 px-4 py-2 self-end rounded-full bg-green-100 text-green-700  hover:bg-green-600 hover:text-green-200 disabled:bg-zinc-400 disabled:text-zinc-100'
            >
                {pending
                    ? <div><RefreshCwIcon className='inline w-4 animate-spin' /> Guardando...</div>
                    : <div><PlusIcon className='inline w-4' /> Guardar </div>
                }
            </button>

            <div className="flex flex-col items-center @lg:flex-row gap-4">
                <InputImage imgUrl='/images/default-pizza.avif' className='self-end size-[30%] object-cover' />

                <div className="w-full grid sm:grid-cols-[100px_auto] auto-rows-min items-center">
                    <label htmlFor="nombre" className="font-bold">Nombre</label>
                    <input id="nombre" name="nombre" placeholder="Nombre" required className="outline-none focus:bg-slate-50" />

                    <label htmlFor="precio" className="font-bold">Precio</label>
                    <input id="precio" name="precio" type='number' step={0.01} min={0} className="outline-none focus:bg-slate-50" />
                </div>
            </div>
            <div>
                <p className="font-bold">Ingredientes</p>
            </div>
        </form>

    );
}

export default PizzaInsertar;