import prisma from '@/lib/prisma'
import { editarNotificacion } from '@/lib/actions'
import { Bell } from 'lucide-react'
import { BackButton } from '@/components/BackButton'
import { NotificationForm } from '@/components/notificaciones/NotificationForm'
import { PageHeader } from '@/components/notificaciones/NotificationPageHeader'

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
          <BackButton href="/notificaciones">Volver a notificaciones</BackButton>
          <PageHeader
            title="Editar notificación" 
            icon={<Bell className="w-8 h-8 text-[#a57551]" />}
          />
        </div>
        
        <NotificationForm
          action={action}
          defaultValues={{
            title: notificacion.title,
            message: notificacion.message
          }}
          isEditing
        />
      </div>
    </div>
  )
}