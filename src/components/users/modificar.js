'use client'
import { editUser } from '@/lib/actions'
import { useActionState, useEffect, useId, useState } from 'react'
import { XIcon, RefreshCwIcon,Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import CheckRadio from '@/components/check-radio'

export default function UserModificar({ user, sessionUser }) {
    const formId = useId()
    const [state, action, pending] = useActionState(editUser, {})
    const [showPassword, setShowPassword] = useState(false)

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
                    defaultValue={user.image || '/images/avatar-80.png'}
                    defaultChecked={true}
                    className="size-14 has-checked:col-span-4 has-checked:row-span-3 has-checked:-order-1 has-checked:size-36 has-checked:bg-green-200 px-2 py-1 rounded-md"
                >
                    <img src={user.image || '/images/avatar-80.png'} alt="Imagen de usuario" />
                </CheckRadio>
            </div>



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
                 <div>
                    <label className="block font-medium mb-2">Contraseña</label>
                    <div className="flex gap-2">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                             placeholder="Nueva contraseña"
                            // defaultValue={user.password}
                            className="w-full p-2 border rounded"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="px-3 border rounded hover:bg-gray-100 transition-colors"
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
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

//NO FUNKA
// 'use client'

// import { editUser } from '@/lib/actions'
// import { useActionState, useEffect, useId, useState } from 'react'
// import { XIcon, RefreshCwIcon, Eye, EyeOff } from 'lucide-react'
// import { toast } from 'sonner'
// import CryptoJS from 'crypto-js'

// const SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_SECRET || 'clave-secreta'

// export default function UserModificar({ user, sessionUser }) {
//     const formId = useId()
//     const [state, action, pending] = useActionState(editUser, {})
//     const [showPassword, setShowPassword] = useState(false)
//     const [currentPassword, setCurrentPassword] = useState('')

//     // 🔐 Desencriptar la contraseña al cargar
//     useEffect(() => {
//         if (user.password) {
//             try {
//                 const bytes = CryptoJS.AES.decrypt(user.password, SECRET_KEY)
//                 const decrypted = bytes.toString(CryptoJS.enc.Utf8)
//                 setCurrentPassword(decrypted || '')
//             } catch (error) {
//                 console.error('Error al descifrar la contraseña:', error)
//                 setCurrentPassword('')
//             }
//         }
//     }, [user.password])

//     // 🔔 Notificaciones
//     useEffect(() => {
//         if (state?.error) {
//             if (state.error.includes('teléfono')) {
//                 toast.error(state.error, {
//                     action: {
//                         onClick: () => document.getElementById('phone').focus()
//                     }
//                 });
//             } else {
//                 toast.error(state.error);
//             }
//         }
//         if (state?.success) {
//             toast.success(state.success);
//             document.getElementById(formId)?.closest('dialog')?.close();
//         }
//     }, [state]);

//     return (
//         <form id={formId} action={action} className="bg-white p-6 rounded-lg max-w-md mx-auto">
//             <div className="flex justify-between mb-4">
//                 <h2 className="text-xl font-bold">Editar usuario</h2>
//                 <button
//                     type="button"
//                     onClick={() => document.getElementById(formId)?.closest('dialog')?.close()}
//                     className="text-gray-500 hover:text-gray-700"
//                 >
//                     <XIcon className="h-6 w-6" />
//                 </button>
//             </div>

//             <input type="hidden" name="id" defaultValue={user.id} />

//             <div className="space-y-4">
//                 <div>
//                     <label className="block font-medium mb-2">Nombre</label>
//                     <input
//                         type="text"
//                         name="name"
//                         defaultValue={user.name}
//                         className="w-full p-2 border rounded"
//                     />
//                 </div>

//                 <div>
//                     <label className="block font-medium mb-2">Teléfono</label>
//                     <input
//                         type="tel"
//                         name="phone"
//                         defaultValue={user.phone}
//                         className="w-full p-2 border rounded"
//                         pattern="[0-9]{9}"
//                         maxLength="9"
//                         title="Número de 9 dígitos"
//                         id="phone"
//                     />
//                 </div>

//                 <div>
//                     <label className="block font-medium mb-2">Contraseña</label>
//                     <div className="flex gap-2">
//                         <input
//                             type={showPassword ? 'text' : 'password'}
//                             name="password"
//                             value={currentPassword}
//                             onChange={(e) => setCurrentPassword(e.target.value)}
//                             className="w-full p-2 border rounded"
//                         />
//                         <button
//                             type="button"
//                             onClick={() => setShowPassword(!showPassword)}
//                             className="px-3 border rounded hover:bg-gray-100 transition-colors"
//                         >
//                             {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                         </button>
//                     </div>
//                 </div>

//                 {sessionUser?.role === 'ADMIN' && sessionUser.id !== user.id && (
//                     <div>
//                         <label className="block font-medium mb-2">Rol</label>
//                         <select
//                             name="role"
//                             defaultValue={user.role}
//                             className="w-full p-2 border rounded"
//                         >
//                             <option value="USER">Usuario</option>
//                             <option value="ADMIN">Administrador</option>
//                         </select>
//                     </div>
//                 )}

//                 <button
//                     type="submit"
//                     disabled={pending}
//                     className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
//                 >
//                     {pending ? (
//                         <RefreshCwIcon className="animate-spin mx-auto" />
//                     ) : (
//                         'Guardar cambios'
//                     )}
//                 </button>
//             </div>
//         </form>
//     )
// }
