// 'use client'

// import Modal from './modal'
// import { useActionState } from 'react'  
// import { crearHorario, editarHorario, eliminarHorario } from '@/lib/actions'

// // Modal para crear horarios
// export function CrearHorarioModal({ tipo }) {
//   const [state, formAction] = useActionState(crearHorario, null)

//  return (
//     <Modal
//       openElement={
//         <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
//           + Nuevo Horario
//         </button>
//       }
//       title="Crear nuevo horario"
//     >
//       <form action={formAction} className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <select name="dia" className="border p-2 rounded" required>
//             <option value="">Selecciona un día</option>
//             <option value="Lunes">Lunes</option>
//             <option value="Martes">Martes</option>
//             <option value="Miércoles">Miércoles</option>
//             <option value="Jueves">Jueves</option>
//             <option value="Viernes">Viernes</option>
//             <option value="Sábado">Sábado</option>
//             <option value="Domingo">Domingo</option>
//           </select>

//           <select name="hora" className="border p-2 rounded" required>
//             <option value="">Selecciona una hora</option>
//             {[
//               "08:00", "09:00", "10:00", "11:00",
//               "12:00", "13:00", "14:00", "15:00",
//               "16:00", "17:00", "18:00", "19:00", "20:00"
//             ].map((hora) => (
//               <option key={hora} value={hora}>{hora}</option>
//             ))}
//           </select>

//           <input type="hidden" name="tipo" value={tipo} />
//         </div>
//         <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
//           Crear Horario
//         </button>
//       </form>
//     </Modal>
//   )
// }

// // Modal para editar horarios
// export function EditarHorarioModal({ horario }) {
//   const [state, formAction] = useActionState(editarHorario, null);

//   return (
//     <Modal
//       openElement={
//         <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
//           Editar
//         </button>
//       }
//       title={`Editar ${horario.dia} - ${horario.hora}`}
//     >
//       <form action={formAction} className="space-y-4">
//         <input 
//           type="hidden" 
//           name="horarioId" 
//           value={horario.id} 
//         />

//         <div className="flex flex-col md:flex-row gap-3 w-full">
//           <select 
//             name="dia" 
//             defaultValue={horario.dia}
//             className="flex-1 px-3 py-2 border rounded-lg bg-white"
//             required
//           >
//             {['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].map(d => (
//               <option key={d} value={d}>{d}</option>
//             ))}
//           </select>

//           <select 
//             name="hora" 
//             defaultValue={horario.hora}
//             className="flex-1 px-3 py-2 border rounded-lg bg-white"
//             required
//           >
//             {["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"].map(h => (
//               <option key={h} value={h}>{h}</option>
//             ))}
//           </select>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//         >
//           Guardar Cambios
//         </button>

//         {state?.error && (
//           <p className="text-red-500 text-sm mt-2">{state.error}</p>
//         )}
//       </form>
//     </Modal>
//   )
// }

// // Modal para eliminar horarios
// export function EliminarHorarioModal({ horarioId }) {
//   return (
//     <Modal
//       openElement={
//         <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
//             Eliminar
//         </button>
//       }
//       title="Confirmar eliminación"
//       danger
//     >
//       <form action={eliminarHorario.bind(null, horarioId)} className="space-y-4">
//         <p className="text-gray-600">¿Estás seguro de querer eliminar este horario?</p>
//         <div className="flex gap-4 justify-end">
//           <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
//             Confirmar
//           </button>
//         </div>
//       </form>
//     </Modal>
//   )
// }

'use client'

import { useActionState, useEffect, useRef } from 'react'
import Modal from './modal'
import { crearHorario, editarHorario, eliminarHorario } from '@/lib/actions'
import { toast } from 'sonner'

// Modal para crear horarios
// export function CrearHorarioModal({ tipo }) {
//     const modalRef = useRef()
//     const [state, formAction] = useActionState(crearHorario, null)

//     useEffect(() => {
//         if (state?.success) {
//             modalRef.current?.closeModal()
//         }
//     }, [state])

//     return (
//         <Modal
//             ref={modalRef}
//             openElement={
//                 <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
//                     + Nuevo Horario
//                 </button>
//             }
//         >

//             <form action={formAction} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <select name="dia" className="border p-2 rounded" required>
//                         <option value="">Selecciona un día</option>
//                         <option value="Lunes">Lunes</option>
//                         <option value="Martes">Martes</option>
//                         <option value="Miércoles">Miércoles</option>
//                         <option value="Jueves">Jueves</option>
//                         <option value="Viernes">Viernes</option>
//                         <option value="Sábado">Sábado</option>
//                         <option value="Domingo">Domingo</option>
//                     </select>

//                     <select name="hora" className="border p-2 rounded" required>
//                         <option value="">Selecciona una hora</option>
//                         {[
//                             "08:00", "09:00", "10:00", "11:00",
//                             "12:00", "13:00", "14:00", "15:00",
//                             "16:00", "17:00", "18:00", "19:00", "20:00"
//                         ].map((hora) => (
//                             <option key={hora} value={hora}>{hora}</option>
//                         ))}
//                     </select>

//                     <input type="hidden" name="tipo" value={tipo} />
//                 </div>
//                 <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
//                     Crear Horario
//                 </button>
//             </form>
//         </Modal>
//     )
// }

export function CrearHorarioModal({ tipo }) {
    const modalRef = useRef()
    const formRef = useRef()
    const [state, formAction] = useActionState(crearHorario, null)

    useEffect(() => {
        if (state?.success) {
            modalRef.current?.closeModal()
            formRef.current?.reset()
            toast.success('Horario creado exitosamente!')
        }
    }, [state])

    return (
        <Modal
            ref={modalRef}
            openElement={
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                    + Nuevo Horario
                </button>
            }
        >
            <form ref={formRef} action={formAction} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select 
                        name="dia" 
                        className="border p-2 rounded-lg bg-white"
                        required
                        defaultValue=""
                    >
                        <option value="" disabled>Selecciona un día</option>
                        <option value="Lunes">Lunes</option>
                        <option value="Martes">Martes</option>
                        <option value="Miércoles">Miércoles</option>
                        <option value="Jueves">Jueves</option>
                        <option value="Viernes">Viernes</option>
                        <option value="Sábado">Sábado</option>
                        <option value="Domingo">Domingo</option>
                    </select>

                    <select 
                        name="hora" 
                        className="border p-2 rounded-lg bg-white"
                        required
                        defaultValue=""
                    >
                        <option value="" disabled>Selecciona una hora</option>
                        {[
                            "08:00", "09:00", "10:00", "11:00",
                            "12:00", "13:00", "14:00", "15:00",
                            "16:00", "17:00", "18:00", "19:00", "20:00"
                        ].map((hora) => (
                            <option key={hora} value={hora}>{hora}</option>
                        ))}
                    </select>
                </div>

                <input type="hidden" name="tipo" value={tipo} />

                <div className="space-y-2">
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                        Crear Horario
                    </button>
                    
                    {/* Mensaje de error */}
                    {state?.error && (
                        <p className="text-red-500 text-sm text-center mt-2 animate-fade-in">
                            {state.error}
                        </p>
                    )}
                </div>
            </form>
        </Modal>
    )
}

// Modal para editar horarios
export function EditarHorarioModal({ horario }) {
    const modalRef = useRef()
    const [state, formAction] = useActionState(editarHorario, null)

    useEffect(() => {
        if (state?.success) {
            modalRef.current?.closeModal()
        }
    }, [state])

    return (
        <Modal
            ref={modalRef}
            openElement={
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    Editar
                </button>
            }
        >
            <form action={formAction} className="space-y-4">
                <input
                    type="hidden"
                    name="horarioId"
                    value={horario.id}
                />

                <div className="flex flex-col md:flex-row gap-3 w-full">
                    <select
                        name="dia"
                        defaultValue={horario.dia}
                        className="flex-1 px-3 py-2 border rounded-lg bg-white"
                        required
                    >
                        {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>

                    <select
                        name="hora"
                        defaultValue={horario.hora}
                        className="flex-1 px-3 py-2 border rounded-lg bg-white"
                        required
                    >
                        {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"].map(h => (
                            <option key={h} value={h}>{h}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                    Guardar Cambios
                   
                </button>

                {state?.error && (
                    <p className="text-red-500 text-sm mt-2">{state.error}</p>
                )}
            </form>
        </Modal>
    )
}

// Modal para eliminar horarios
export function EliminarHorarioModal({ horarioId }) {
    const modalRef = useRef()
    const [state, formAction] = useActionState(eliminarHorario, null)

    useEffect(() => {
        if (state?.success) {
            modalRef.current?.closeModal()
        }
    }, [state])

    return (
        <Modal
            ref={modalRef}
            openElement={
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
                    Eliminar
                </button>
            }
        >
            <form action={formAction} className="space-y-4">
                <input type="hidden" name="horarioId" value={horarioId} />
                <p className="text-gray-600">¿Estás seguro de querer eliminar este horario?</p>
                <div className="flex gap-4 justify-end">
                    <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        Confirmar
                    </button>
                </div>
            </form>
        </Modal>
    )
}