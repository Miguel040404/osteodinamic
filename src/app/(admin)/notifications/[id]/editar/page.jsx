import prisma from '@/lib/prisma'
import { editarNotificacion } from '@/lib/actions'
import { Bell, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function EditarNotificacionPage({ params }) {
  const notificacion = await prisma.notification.findUnique({
    where: { id: params.id },
  })

  async function action(formData) {
    'use server'
    return editarNotificacion(params.id, formData)
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
              <Bell className="w-8 h-8 text-[#a57551]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#4d4037]">Editar notificación</h1>
          </div>
        </div>

        <form action={action} className="space-y-6 bg-[#f9faf5] p-6 rounded-xl shadow-sm border border-[#b9b59c]">
          <div className="space-y-2">
            <label className="text-[#4d4037] font-medium">Título de la notificación</label>
            <input
              type="text"
              name="title"
              defaultValue={notificacion.title}
              required
              className="bg-white !text-[#4d4037] w-full border border-[#b9b59c] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#a57551] focus:border-[#a57551] outline-none transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[#4d4037] font-medium">Contenido del mensaje</label>
            <textarea
              name="message"
              defaultValue={notificacion.message}
              required
              rows={5}
              className="bg-white !text-[#4d4037] w-full border border-[#b9b59c] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#a57551] focus:border-[#a57551] outline-none transition resize-none"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#a57551] hover:bg-[#8f5e40] text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
