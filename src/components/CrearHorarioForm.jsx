// "use client";

// import { useActionState } from "react";
// import { crearHorario } from "@/lib/actions";
// import { useEffect } from "react";
// import { toast } from "sonner";

// export const CrearHorarioForm = ({ tipo }) => {
//     const [state, formAction] = useActionState(crearHorario, null);

//     useEffect(() => {
//         if (state?.message) {
//             if (state.success) {
//                 toast.success(state.message);
//             } else {
//                 toast.error(state.message);
//             }
//         }
//     }, [state]);

//     return (
//         <form action={formAction} className="space-y-4">
//             <h3 className="text-lg font-semibold">Añadir nuevo horario</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

//                 <select name="dia" className="border p-2 rounded" required>
//                     <option value="">Selecciona un día</option>
//                     <option value="Lunes">Lunes</option>
//                     <option value="Martes">Martes</option>
//                     <option value="Miércoles">Miércoles</option>
//                     <option value="Jueves">Jueves</option>
//                     <option value="Viernes">Viernes</option>
//                     <option value="Sábado">Sábado</option>
//                     <option value="Domingo">Domingo</option>
//                 </select>

//                 <select name="hora" className="border p-2 rounded" required>
//                     <option value="">Selecciona una hora</option>
//                     {[
//                         "08:00", "09:00", "10:00", "11:00",
//                         "12:00", "13:00", "14:00", "15:00",
//                         "16:00", "17:00", "18:00", "19:00", "20:00"
//                     ].map((hora) => (
//                         <option key={hora} value={hora}>{hora}</option>
//                     ))}
//                 </select>

//                 <input type="hidden" name="tipo" value={tipo} />
//             </div>

//             {state?.error && (
//                 <p className="text-red-500 text-sm">{state.error}</p>
//             )}

//             <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
//                 Crear Horario
//             </button>
//         </form>
//     );
// };

// //viejo
// "use client";

// import { useActionState } from "react";
// import { crearHorario } from "@/lib/actions";
// import { useEffect } from "react";
// import { toast } from "sonner";

// export async function crearHorario(prevState, formData) {
//     const [state, formAction] = useActionState(crearHorario, null);

//     useEffect(() => {
//         if (state?.message) {
//             if (state.success) {
//                 toast.success(state.message);
//             } else {
//                 toast.error(state.message);
//             }
//         }
//     }, [state]);


//     return (
//         <form action={formAction} className="space-y-4">
//             <h3 className="text-lg font-semibold">Añadir nuevo horario</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

//                 <select name="dia" className="border p-2 rounded" required>
//                     <option value="">Selecciona un día</option>
//                     <option value="Lunes">Lunes</option>
//                     <option value="Martes">Martes</option>
//                     <option value="Miércoles">Miércoles</option>
//                     <option value="Jueves">Jueves</option>
//                     <option value="Viernes">Viernes</option>
//                     <option value="Sábado">Sábado</option>
//                     <option value="Domingo">Domingo</option>
//                 </select>

//                 <select name="hora" className="border p-2 rounded" required>
//                     <option value="">Selecciona una hora</option>
//                     {[
//                         "08:00", "09:00", "10:00", "11:00",
//                         "12:00", "13:00", "14:00", "15:00",
//                         "16:00", "17:00", "18:00", "19:00", "20:00"
//                     ].map((hora) => (
//                         <option key={hora} value={hora}>{hora}</option>
//                     ))}
//                 </select>

//                 <input type="hidden" name="tipo" value={tipo} />
//             </div>

//             {state?.error && (
//                 <p className="text-red-500 text-sm">{state.error}</p>
//             )}

//             <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
//                 Crear Horario
//             </button>
//         </form>
//     );
// };

'use client'

import { useActionState, useEffect, useRef } from 'react'
import { crearHorario, editarHorario, eliminarHorario } from '@/lib/actions'
import { toast } from 'sonner'
import Modal from './modal'

// Modal Crear viejo
// export function CrearHorarioModal({ tipo }) {
//   const modalRef = useRef()
//   const formRef = useRef()
//   const [state, formAction] = useActionState(crearHorario, null)

//   useEffect(() => {
//     if (state?.success) {
//       modalRef.current?.closeModal()
//       formRef.current?.reset()
//       toast.success('Horario creado!')
//     }
//     if (state?.error) toast.error(state.error)
//   }, [state])

//   return (
//     <Modal
//       ref={modalRef}
//       openElement={
//         <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
//           + Nuevo Horario
//         </button>
//       }
//     >
//       <form ref={formRef} action={formAction} className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* Campos del formulario... */}
//         </div>
//         <input type="hidden" name="tipo" value={tipo} />
//         <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
//           Crear Horario
//         </button>
//       </form>
//     </Modal>
//   )
// }
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
            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(dia => (
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
              "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"].map(hora => (
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
            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            name="hora"
            defaultValue={horario.hora}
            className="flex-1 px-3 py-2 border rounded-lg bg-white"
          >
            {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", 
              "16:00", "17:00", "18:00", "19:00", "20:00"].map(h => (
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