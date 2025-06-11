'use client'

import { crearNotificacion } from '@/lib/actions'
import { BellPlus } from 'lucide-react'
import { useState } from 'react'
import { NotificationForm } from '@/components/notificaciones/NotificationForm'
import { BackButton } from '@/components/BackButton'
import { PageHeader } from '@/components/notificaciones/NotificationPageHeader'


export default function CrearNotificacionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    await crearNotificacion(new FormData(e.target))
  }

  return (
    <div className="min-h-screen bg-[#f9faf5]">
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="mb-8">
          <BackButton href="/notificaciones">Volver a notificaciones</BackButton>
          <PageHeader
            title="Crear nueva notificación"
            icon={<BellPlus className="w-8 h-8 text-[#a57551]" />}
          />
        </div>

        <NotificationForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}