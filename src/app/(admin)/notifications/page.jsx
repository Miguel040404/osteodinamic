'use client'

import { crearNotificacion } from '@/lib/actions'
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
    // Aquí podrías redirigir o limpiar el formulario
  }

  return (
    <div className="min-h-screen bg-[#f9faf5]">
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="mb-8">
          <Link href="/notificaciones" className="flex items-center gap-2 text-[#a57551] hover:text-[#7b5b3e] mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a notificaciones</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="bg-[#e8d7c3] p-3 rounded-lg">
              <BellPlus className="w-8 h-8 text-[#a57551]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#4d4037]">Crear nueva notificación</h1>
          </div>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="space-y-6 bg-[#f9faf5] p-6 rounded-xl shadow-sm border border-[#b9b59c]"
        >
          <div className="space-y-2">
            <label className="text-[#4d4037] font-medium">Título de la notificación</label>
            <input
              type="text"
              name="title"
              placeholder="Escribe un título descriptivo"
              required
              disabled={isSubmitting}
              className="bg-white w-full border !text-[#4d4037] border-[#b9b59c] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#a57551] focus:border-[#a57551] outline-none transition disabled:opacity-70"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[#4d4037] font-medium">Contenido del mensaje</label>
            <textarea
              name="message"
              placeholder="Escribe el contenido completo de la notificación"
              required
              rows={5}
              disabled={isSubmitting}
              className="bg-white w-full border !text-[#4d4037] border-[#b9b59c] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#a57551] focus:border-[#a57551] outline-none transition resize-none disabled:opacity-70"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`cursor-pointer  w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                isSubmitting 
                  ? 'bg-[#c9bfa9] cursor-not-allowed' 
                  : 'bg-[#a57551] hover:bg-[#8f5e40] shadow-sm hover:shadow-md'
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