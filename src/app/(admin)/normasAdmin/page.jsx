'use client'

import { crearNorma } from '@/lib/actions'
import { BookPlus } from 'lucide-react'
import { useState } from 'react'
import { SubmitButton } from '@/components/SubmitButton'
import { BackButton } from '@/components/BackButton'
import NormasPageHeader from '@/components/normas/NormasPageHeader'

export default function CrearNormaPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    await crearNorma(new FormData(e.target))
  }

  return (
    <div className="min-h-screen bg-[#f9faf5]">
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="mb-8">
          <BackButton href="/normas">Volver a normas</BackButton>
          <NormasPageHeader
            title="Crear nueva norma"
            icon={<BookPlus className="w-8 h-8 text-[#a57551]" />}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-[#f9faf5] p-6 rounded-xl shadow-sm border border-[#b9b59c]">
          <div className="space-y-2">
            <label className="text-[#4d4037] font-medium">Título de la norma</label>
            <input
              type="text"
              name="titulo"
              placeholder="Escribe un título descriptivo"
              required
              disabled={isSubmitting}
              className="w-full border bg-white border-[#b9b59c] rounded-lg px-4 py-3 text-[#4d4037] focus:ring-2 focus:ring-[#a57551] focus:border-[#a57551] outline-none transition disabled:opacity-70"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[#4d4037] font-medium">Contenido de la norma</label>
            <textarea
              name="contenido"
              placeholder="Escribe el contenido completo de la norma"
              required
              rows={5}
              disabled={isSubmitting}
              className="w-full border bg-white border-[#b9b59c] rounded-lg px-4 py-3 text-[#4d4037] focus:ring-2 focus:ring-[#a57551] focus:border-[#a57551] outline-none transition resize-none disabled:opacity-70"
            />
          </div>

          <div className="pt-4">
            <SubmitButton isSubmitting={isSubmitting}>
              Publicar norma
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}