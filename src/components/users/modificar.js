// 'use client'
// import { editUser } from '@/lib/actions'
// import { useActionState, useEffect, useId } from 'react'
// import { PlusIcon, RefreshCwIcon, UserIcon } from 'lucide-react';
// import { toast } from 'sonner';
// import Check from '../check';


// export default function UserModificar({ user }) {
//     const formId = useId()
//     const [state, action, pending] = useActionState(editUser, {})

//     useEffect(() => {
//         if (state?.success) {
//             toast.success(state.success)
//             document.getElementById(formId).closest('dialog')?.close() // Si el padre es un dialog, lo cerramos
//         }
//         if (state?.error) toast.error(state.error)

//     }, [formId, state])


//     return (
//         <form id={formId} action={action} className="w-full flex flex-col px-4">
//             <input type="hidden" name="id" defaultValue={user.id} />

//             <button type="submit" disabled={pending}
//                 className='self-end mb-4 font-bold bg-amber-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-amber-700 hover:text-gray-100 disabled:bg-zinc-400'
//             >
//                 {pending
//                     ? <div><RefreshCwIcon className='inline animate-spin' /> Actualizando...</div>
//                     : <div><PlusIcon className='inline' /> Actualizar </div>
//                 }
//             </button>

//             {user.image
//                 ? <img src={user.image} alt="Imagen de usuario" width={64} />
//                 : <UserIcon className="size-16" />
//             }

//             <div className='flex flex-col md:flex-row md:gap-10'>

//                 <div className='w-full md:w-2/3 flex flex-col gap-2'>

//                     <div className="flex flex-col md:flex-row items-center md:space-x-4">
//                         <label htmlFor='name' className="font-bold w-full md:w-1/4">Nombre</label>
//                         <input type='text' id='name' name='name'
//                             defaultValue={user.name}
//                             className="w-full md:w-3/4 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 bg-gray-100"
//                         />
//                     </div>

//                     <div className="flex flex-col md:flex-row items-center md:space-x-4">
//                         <label htmlFor='email' className="font-bold w-full md:w-1/4">email</label>
//                         <input type='text' id='email' name='email'
//                             defaultValue={user.email}
//                             className="w-full md:w-3/4 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 bg-gray-100"
//                         />
//                     </div>

//                 </div>
//             </div>

//         </form>
//     )
// }

'use client'
import { editUser } from '@/lib/actions'
import { useActionState, useEffect, useId } from 'react'
import { PlusIcon, RefreshCwIcon, UserIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import Check from '../check';

export default function UserModificar({ user }) {
    const formId = useId()
    const [state, action, pending] = useActionState(editUser, {})

    useEffect(() => {
        if (state?.success) {
            toast.success(state.success)
            document.getElementById(formId).closest('dialog')?.close() 
        }
        if (state?.error) toast.error(state.error)

    }, [formId, state])

    const closeModal = () => {
        document.getElementById(formId).closest('dialog')?.close();
    };

    return (
        <form id={formId} action={action} className="fixed inset-0 bg-white flex flex-col p-4">
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={closeModal}
                    className="mb-4 font-bold bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 hover:text-gray-100"
                >
                    <XIcon className='inline' /> Cerrar
                </button>
            </div>

            <input type="hidden" name="id" defaultValue={user.id} />

            <button type="submit" disabled={pending}
                className='self-end mb-4 font-bold bg-amber-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-amber-700 hover:text-gray-100 disabled:bg-zinc-400'
            >
                {pending
                    ? <div><RefreshCwIcon className='inline animate-spin' /> Actualizando...</div>
                    : <div><PlusIcon className='inline' /> Actualizar </div>
                }
            </button>

            {user.image
                ? <img src={user.image} alt="Imagen de usuario" width={64} />
                : <UserIcon className="size-16" />
            }

            <div className='flex flex-col md:flex-row md:gap-10'>

                <div className='w-full md:w-2/3 flex flex-col gap-2'>

                    <div className="flex flex-col md:flex-row items-center md:space-x-4">
                        <label htmlFor='name' className="font-bold w-full md:w-1/4">Nombre</label>
                        <input type='text' id='name' name='name'
                            defaultValue={user.name}
                            className="w-full md:w-3/4 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 bg-gray-100"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row items-center md:space-x-4">
                        <label htmlFor='email' className="font-bold w-full md:w-1/4">email</label>
                        <input type='text' id='email' name='email'
                            defaultValue={user.email}
                            className="w-full md:w-3/4 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 bg-gray-100"
                        />
                    </div>

                </div>
            </div>

        </form>
    )
}
