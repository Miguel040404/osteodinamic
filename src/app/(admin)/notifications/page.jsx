'use client'

import { crearNotificacion } from './actions'
import { BellPlus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function CrearNotificacionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)

    const formData = new FormData(e.target)
    await crearNotificacion(formData)
    
    // Opcional: redirigir o limpiar el formulario aquí
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50">
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="mb-8">
          <Link href="/notificaciones" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a notificaciones</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <BellPlus className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Crear nueva notificación</h1>
          </div>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Título de la notificación</label>
            <input
              type="text"
              name="title"
              placeholder="Escribe un título descriptivo"
              required
              disabled={isSubmitting}
              className="w-full border !text-gray-800 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition disabled:opacity-70"
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Contenido del mensaje</label>
            <textarea
              name="message"
              placeholder="Escribe el contenido completo de la notificación"
              required
              rows={5}
              disabled={isSubmitting}
              className="w-full border !text-gray-800 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none disabled:opacity-70"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                isSubmitting 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow-md'
              } text-white`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publicando...
                </>
              ) : 'Publicar notificación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// import { crearNotificacion } from './actions'
// import { BellPlus, ArrowLeft } from 'lucide-react'
// import Link from 'next/link'

// export default function CrearNotificacionPage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50">
//       <div className="max-w-2xl mx-auto py-10 px-4">
//         <div className="mb-8">
//           <Link href="/notificaciones" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-4">
//             <ArrowLeft className="w-5 h-5" />
//             <span>Volver a notificaciones</span>
//           </Link>
          
//           <div className="flex items-center gap-3">
//             <div className="bg-indigo-100 p-3 rounded-lg">
//               <BellPlus className="w-8 h-8 text-indigo-600" />
//             </div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Crear nueva notificación</h1>
//           </div>
//         </div>

//         <form action={crearNotificacion} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//           <div className="space-y-2">
//             <label className="text-gray-700 font-medium">Título de la notificación</label>
//             <input
//               type="text"
//               name="title"
//               placeholder="Escribe un título descriptivo"
//               required
//               className="w-full border !text-gray-800 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
//             />
//           </div>

//           <div className="space-y-2">
//             <label className="text-gray-700 font-medium">Contenido del mensaje</label>
//             <textarea
//               name="message"
//               placeholder="Escribe el contenido completo de la notificación"
//               required
//               rows={5}
//               className="w-full border !text-gray-800 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
//             />
//           </div>

//           <div className="pt-4">
//             <button
//               type="submit"
//               className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
//             >
//               Publicar notificación
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }