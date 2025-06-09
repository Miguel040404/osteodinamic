"use client"

import { newUser } from '@/lib/actions'
import { useActionState, useEffect, useId } from 'react'
import { PlusIcon, RefreshCwIcon } from 'lucide-react';
import { toast } from 'sonner';
import CheckRadio from '../check-radio';

export default function UserInsertar() {
    const formId = useId()
    const [state, action, pending] = useActionState(newUser, {})

    useEffect(() => {
        if (state?.success) {
            toast.success(state.success)
            document.getElementById(formId).closest('dialog')?.close() // Si el padre es un dialog, lo cerramos
        }
        if (state?.error) toast.error(state.error)

    }, [formId, state])

    return (
        <form id={formId} action={action} className="w-full flex flex-col px-4">

            <button type="submit" disabled={pending}
                className='cursor-pointer self-end mb-4 font-bold bg-green-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-700 hover:text-gray-100 disabled:bg-zinc-400'
            >
                {pending
                    ? <div><RefreshCwIcon className='inline animate-spin' /> Guardando...</div>
                    : <div><PlusIcon className='inline' /> Guardar</div>
                }
            </button>

            <div className='grid place-items-center grid-cols-[repeat(auto-fill,minmax(40px,1fr))]'>
                {/* Avatares 00 .. 79 */}
                {[...Array(80)].map((_, index) => (
                    <CheckRadio key={index}
                        name='image'
                        defaultValue={`/images/avatar-${String(index).padStart(2, '0')}.png`}
                        className="size-14 has-checked:col-span-4 has-checked:row-span-3 has-checked:-order-1 has-checked:size-36 has-checked:bg-green-200 px-2 py-1 rounded-md"
                    >
                        <img src={`/images/avatar-${String(index).padStart(2, '0')}.png`} alt="Imagen de usuario" />
                    </CheckRadio>
                ))}
                {/* por defecto */}
                <CheckRadio key={80}
                    name='image'
                    defaultValue={'/images/avatar-80.png'}
                    defaultChecked={true}
                    className="size-14 has-checked:col-span-4 has-checked:row-span-3 has-checked:-order-1 has-checked:size-36 has-checked:bg-green-200 px-2 py-1 rounded-md"
                >
                    <img src={'/images/avatar-80.png'} alt="Imagen de usuario" />
                </CheckRadio>
            </div>

            <div className='flex flex-col md:flex-row md:gap-10'>
                <div className='w-full md:w-2/3 flex flex-col gap-2'>

                    <div className="flex flex-col md:flex-row items-center md:space-x-4">
                        <label htmlFor='name' className="font-bold w-full md:w-1/4">Nombre</label>
                        <input type='text' id='name' name='name'
                            className="w-full md:w-3/4 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 bg-gray-100"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row items-center md:space-x-4">
                        <label htmlFor='email' className="font-bold w-full md:w-1/4">email</label>
                        <input type='email' id='email' name='email'
                            className="w-full md:w-3/4 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 bg-gray-100"
                        />
                    </div>
                </div>
            </div>
        </form>
    )
}