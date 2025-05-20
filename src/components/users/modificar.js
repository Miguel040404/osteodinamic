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



// 'use client'
// import { editUser } from '@/lib/actions'
// import { useActionState, useEffect, useId } from 'react'
// import { PlusIcon, RefreshCwIcon, UserIcon, XIcon } from 'lucide-react';
// import { toast } from 'sonner';
// import Check from '../check';

// export default function UserModificar({ user, sessionUser }) {
//     const formId = useId()
//     const [state, action, pending] = useActionState(editUser, {})

//     useEffect(() => {
//         console.log("State updated:", state);
//         if (state?.success) {
//             toast.success(state.success)
//             document.getElementById(formId).closest('dialog')?.close()
//         }
//         if (state?.error) toast.error(state.error)
//     }, [formId, state])

//     const closeModal = () => {
//         document.getElementById(formId).closest('dialog')?.close();
//     };

//     return (
//         <form id={formId} action={action} className="fixed inset-0 bg-white flex flex-col p-4">
//             <div className="flex justify-end">
//                 <button
//                     type="button"
//                     onClick={closeModal}
//                     className="mb-4 font-bold bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 hover:text-gray-100"
//                 >
//                     <XIcon className='inline' /> Cerrar
//                 </button>
//             </div>

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
//                         <label htmlFor='email' className="font-bold w-full md:w-1/4">Email</label>
//                         <input type='text' id='email' name='email'
//                             defaultValue={user.email}
//                             className="w-full md:w-3/4 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 bg-gray-100"
//                         />
//                     </div>

//                     {sessionUser?.role === 'ADMIN' && sessionUser.id !== user.id && (
//                         <div className="flex flex-col md:flex-row items-center md:space-x-4">
//                             <label htmlFor='role' className="font-bold w-full md:w-1/4">Rol</label>
//                             <select
//                                 id="role"
//                                 name="role"
//                                 defaultValue={user.role}
//                                 className="w-full md:w-3/4 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 bg-gray-100"
//                             >
//                                 <option value="USER">Usuario</option>
//                                 <option value="ADMIN">Admin</option>
//                             </select>
//                         </div>
//                     )}

//                 </div>
//             </div>
//         </form>
//     )
// }


'use client'
import { editUser } from '@/lib/actions'
import { useActionState, useEffect, useId } from 'react'
import { XIcon, RefreshCwIcon } from 'lucide-react'
import { toast } from 'sonner'

export default function UserModificar({ user, sessionUser }) {
    const formId = useId()
    const [state, action, pending] = useActionState(editUser, {})

    useEffect(() => {
        if (state?.error) {
            if (state.error.includes('teléfono')) {
                toast.error(state.error, {
                    action: {
                        onClick: () => document.getElementById('phone').focus()
                    }
                });
            } else {
                toast.error(state.error);
            }
        }
        if (state?.success) {
            toast.success(state.success);
            document.getElementById(formId)?.closest('dialog')?.close();
        }
    }, [state]);

    return (
        <form id={formId} action={action} className="bg-white p-6 rounded-lg max-w-md mx-auto">
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Editar usuario</h2>
                <button
                    type="button"
                    onClick={() => document.getElementById(formId)?.closest('dialog')?.close()}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <XIcon className="h-6 w-6" />
                </button>
            </div>

            <input type="hidden" name="id" defaultValue={user.id} />

            <div className="space-y-4">
                <div>
                    <label className="block font-medium mb-2">Nombre</label>
                    <input
                        type="text"
                        name="name"
                        defaultValue={user.name}
                        className="w-full p-2 border rounded"
                    />
                </div>

      // Añadir campo de teléfono en el formulario
                <div>
                    <label className="block font-medium mb-2">Teléfono</label>
                    <input
                        type="tel"
                        name="phone"
                        defaultValue={user.phone}
                        className="w-full p-2 border rounded"
                        pattern="[0-9]{9}"
                        maxLength="9"
                        title="Número de 9 dígitos"
                    />
                </div>

                {sessionUser?.role === 'ADMIN' && sessionUser.id !== user.id && (
                    <div>
                        <label className="block font-medium mb-2">Rol</label>
                        <select
                            name="role"
                            defaultValue={user.role}
                            className="w-full p-2 border rounded"
                        >
                            <option value="USER">Usuario</option>
                            <option value="ADMIN">Administrador</option>
                        </select>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={pending}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {pending ? (
                        <RefreshCwIcon className="animate-spin mx-auto" />
                    ) : (
                        'Guardar cambios'
                    )}
                </button>
            </div>
        </form>
    )
}