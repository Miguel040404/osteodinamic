import prisma from '@/lib/prisma'
import { editarNorma } from '@/lib/actions'

import { Book, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function EditarNormaPage({ params }) {
  const norma = await prisma.norma.findUnique({
    where: { id: params.id },
  })

  if (!norma) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center text-red-600">
        No se encontró la norma solicitada.
      </div>
    )
  }

  // Acción para el formulario
  async function action(formData) {
    'use server'
    return editarNorma(params.id, formData)
  }

  return (
   <div className="min-h-screen bg-[#f9faf5]">
  <div className="max-w-2xl mx-auto py-10 px-4">
    <div className="mb-8">
      <Link href="/normas" className="flex items-center gap-2 text-[#a57551] hover:text-[#7b5b3e] mb-4">
        <ArrowLeft className="w-5 h-5" />
        <span>Volver a normas</span>
      </Link>

      <div className="flex items-center gap-3">
        <div className="bg-[#e8d7c3] p-3 rounded-lg">
          <Book className="w-8 h-8 text-[#a57551]" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#4d4037]">Editar norma</h1>
      </div>
    </div>

    <form
      action={action}
      className="space-y-6 bg-[#f9faf5] p-6 rounded-xl shadow-sm border border-[#b9b59c]"
    >
      <div className="space-y-2">
        <label className="text-[#4d4037] font-medium">Título de la norma</label>
        <input
          type="text"
          name="titulo"
          defaultValue={norma.titulo}
          required
          className="w-full bg-white border border-[#b9b59c] rounded-lg px-4 py-3 text-[#4d4037] focus:ring-2 focus:ring-[#a57551] focus:border-[#a57551] outline-none transition"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[#4d4037] font-medium">Contenido</label>
        <textarea
          name="contenido"
          defaultValue={norma.contenido}
          required
          rows={5}
          className="w-full bg-white border border-[#b9b59c] rounded-lg px-4 py-3 text-[#4d4037] focus:ring-2 focus:ring-[#a57551] focus:border-[#a57551] outline-none transition resize-none"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-[#a57551] hover:bg-[#8d6040] text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
        >
          Guardar cambios
        </button>
      </div>
    </form>
  </div>
</div>

  )
}
