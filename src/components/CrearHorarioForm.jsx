'use client'

import { useActionState, useEffect, useRef } from 'react'
import { crearHorario, editarHorario, eliminarHorario } from '@/lib/actions'
import { toast } from 'sonner'
import Modal from './modal'

export function CrearHorarioModal({ tipo }) {
  const modalRef = useRef();
  const formRef = useRef();
  const [state, formAction] = useActionState(crearHorario, null);

  useEffect(() => {
    if (state?.success) {
      modalRef.current?.closeModal();
      formRef.current?.reset();
      toast.success('Horario creado exitosamente!');
    }
  }, [state]);

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
            {/* {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(dia => ( */}
            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(dia => (

              <option key={dia} value={dia}>{dia}</option>
            ))}
          </select>

          <select
            name="hora"
            className="border p-2 rounded-lg bg-white"
            required
            defaultValue=""
          >
            <option value="" disabled>Selecciona una hora</option>
            {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
              "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"].map(hora => (
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

          {state?.error && (
            <p className="text-red-500 text-sm text-center animate-fade-in">
              {state.error}
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
}
// Modal Editar
export function EditarHorarioModal({ horario }) {
  const modalRef = useRef();
  const [state, formAction] = useActionState(editarHorario, null);
  const formRef = useRef();

  useEffect(() => {
    if (state?.success) {
      modalRef.current?.closeModal();
      toast.success('Cambios guardados exitosamente!');
      formRef.current?.reset();
    }
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <Modal
      ref={modalRef}
      openElement={
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Editar
        </button>
      }
    >
      <form ref={formRef} action={formAction} className="space-y-4">
        <input type="hidden" name="horarioId" value={horario.id} />
        <input type="hidden" name="tipoOriginal" value={horario.tipo} />

        <div className="flex flex-col md:flex-row gap-3 w-full">
          <select
            name="dia"
            defaultValue={horario.dia}
            className="flex-1 px-3 py-2 border rounded-lg bg-white"
          >
            {/* {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(d => ( */}
            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(d => (

              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            name="hora"
            defaultValue={horario.hora}
            className="flex-1 px-3 py-2 border rounded-lg bg-white"
          >
            {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
              "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"].map(h => (
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
  );
}
// Modal Eliminar
export function EliminarHorarioModal({ horarioId }) {
  const modalRef = useRef()
  const [state, formAction] = useActionState(eliminarHorario, null)

  useEffect(() => {
    if (state?.success) {
      modalRef.current?.closeModal()
      toast.success('Horario eliminado!')
    }
    if (state?.error) toast.error(state.error)
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
      <form action={formAction}>
        <input type="hidden" name="horarioId" value={horarioId} />
        {/* Contenido del modal... */}
      </form>
    </Modal>
  )
}

// cambios

// 'use client'

// import { useActionState, useEffect, useRef } from 'react'
// import { crearHorario, editarHorario, eliminarHorario } from '@/lib/actions'
// import { toast } from 'sonner'
// import Modal from './modal'

// export function CrearHorarioModal({ tipo }) {
//   const modalRef = useRef();
//   const formRef = useRef();
//   const [state, formAction] = useActionState(crearHorario, null);

//   useEffect(() => {
//     if (state?.success) {
//       modalRef.current?.closeModal();
//       formRef.current?.reset();
//       toast.success('Horario creado exitosamente!');
//     }
//   }, [state]);

//   return (
//     <Modal
//       ref={modalRef}
//       openElement={
//         <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
//           </svg>
//           Nuevo Horario
//         </button>
//       }
//       title="Crear Nuevo Horario"
//     >
//       <form ref={formRef} action={formAction} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           <div className="space-y-1">
//             <label className="block text-sm font-medium text-gray-600 ml-1">Día</label>
//             <select
//               name="dia"
//               className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//               required
//               defaultValue=""
//             >
//               <option value="" disabled>Selecciona un día</option>
//               {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(dia => (
//                 <option key={dia} value={dia}>{dia}</option>
//               ))}
//             </select>
//           </div>
          
//           <div className="space-y-1">
//             <label className="block text-sm font-medium text-gray-600 ml-1">Hora</label>
//             <select
//               name="hora"
//               className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//               required
//               defaultValue=""
//             >
//               <option value="" disabled>Selecciona una hora</option>
//               {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
//                 "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"].map(hora => (
//                   <option key={hora} value={hora}>{hora}</option>
//                 ))}
//             </select>
//           </div>
//         </div>

//         <input type="hidden" name="tipo" value={tipo} />

//         <div className="space-y-3 pt-2">
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3.5 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 font-medium shadow-lg hover:shadow-emerald-200"
//           >
//             Crear Horario
//           </button>

//           {state?.error && (
//             <div className="mt-3 px-4 py-2.5 bg-red-50 border border-red-100 rounded-lg text-center animate-fade-in">
//               <p className="text-red-600 font-medium">{state.error}</p>
//             </div>
//           )}
//         </div>
//       </form>
//     </Modal>
//   );
// }

// Modal Editar
// export function EditarHorarioModal({ horario }) {
//   const modalRef = useRef();
//   const [state, formAction] = useActionState(editarHorario, null);
//   const formRef = useRef();

//   useEffect(() => {
//     if (state?.success) {
//       modalRef.current?.closeModal();
//       toast.success('Cambios guardados exitosamente!');
//       formRef.current?.reset();
//     }
//     if (state?.error) toast.error(state.error);
//   }, [state]);

//   return (
//     <Modal
//       ref={modalRef}
//       openElement={
//         <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//             <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//           </svg>
//           Editar
//         </button>
//       }
//       title="Editar Horario"
//     >
//       <form ref={formRef} action={formAction} className="space-y-6">
//         <input type="hidden" name="horarioId" value={horario.id} />
//         <input type="hidden" name="tipoOriginal" value={horario.tipo} />

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           <div className="space-y-1">
//             <label className="block text-sm font-medium text-gray-600 ml-1">Día</label>
//             <select
//               name="dia"
//               defaultValue={horario.dia}
//               className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//             >
//               {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(d => (
//                 <option key={d} value={d}>{d}</option>
//               ))}
//             </select>
//           </div>
          
//           <div className="space-y-1">
//             <label className="block text-sm font-medium text-gray-600 ml-1">Hora</label>
//             <select
//               name="hora"
//               defaultValue={horario.hora}
//               className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//             >
//               {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
//                 "16:00", "17:00", "18:00", "19:00", "20:00"].map(h => (
//                   <option key={h} value={h}>{h}</option>
//                 ))}
//             </select>
//           </div>
//         </div>

//         <div className="space-y-3 pt-2">
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3.5 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-blue-200"
//           >
//             Guardar Cambios
//           </button>

//           {state?.error && (
//             <div className="mt-3 px-4 py-2.5 bg-red-50 border border-red-100 rounded-lg text-center">
//               <p className="text-red-600 font-medium">{state.error}</p>
//             </div>
//           )}
//         </div>
//       </form>
//     </Modal>
//   );
// }

// // Modal Eliminar
// export function EliminarHorarioModal({ horarioId }) {
//   const modalRef = useRef()
//   const [state, formAction] = useActionState(eliminarHorario, null)

//   useEffect(() => {
//     if (state?.success) {
//       modalRef.current?.closeModal()
//       toast.success('Horario eliminado!')
//     }
//     if (state?.error) toast.error(state.error)
//   }, [state])

//   return (
//     <Modal
//       ref={modalRef}
//       openElement={
//         <button className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
//           </svg>
//           Eliminar
//         </button>
//       }
//       title="Confirmar Eliminación"
//     >
//       <form action={formAction} className="space-y-6">
//         <input type="hidden" name="horarioId" value={horarioId} />
        
//         <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-center">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//           </svg>
          
//           <h3 className="text-lg font-semibold text-rose-700 mt-3">¿Estás seguro?</h3>
//           <p className="text-gray-600 mt-2">Esta acción eliminará permanentemente el horario seleccionado.</p>
//         </div>

//         <div className="grid grid-cols-2 gap-4 pt-2">
//           <button
//             type="button"
//             onClick={() => modalRef.current?.closeModal()}
//             className="px-4 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200"
//           >
//             Cancelar
//           </button>
          
//           <button
//             type="submit"
//             className="px-4 py-3.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-medium shadow-md transition-all duration-300"
//           >
//             Eliminar
//           </button>
//         </div>
        
//         {state?.error && (
//           <div className="mt-3 px-4 py-2.5 bg-red-50 border border-red-100 rounded-lg text-center">
//             <p className="text-red-600 font-medium">{state.error}</p>
//           </div>
//         )}
//       </form>
//     </Modal>
//   )
// }
