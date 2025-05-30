import { crearNotificacion } from './actions'
import { BellPlus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CrearNotificacionPage() {
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

        <form action={crearNotificacion} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Título de la notificación</label>
            <input
              type="text"
              name="title"
              placeholder="Escribe un título descriptivo"
              required
              className="w-full border !text-gray-800 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Contenido del mensaje</label>
            <textarea
              name="message"
              placeholder="Escribe el contenido completo de la notificación"
              required
              rows={5}
              className="w-full border !text-gray-800 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
            >
              Publicar notificación
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}