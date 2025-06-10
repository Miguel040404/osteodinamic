import prisma from '@/lib/prisma'
import { editarNorma } from '@/lib/actions'
import { Book } from 'lucide-react'
import { BackButton } from '@/components/BackButton'
import NormasPageHeader from '@/components/normas/NormasPageHeader'
import { NormForm } from '@/components/normas/NormForm'



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

  async function action(formData) {
    'use server'
    return editarNorma(params.id, formData)
  }

  return (
    <div className="min-h-screen bg-[#f9faf5]">
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="mb-8">
          <BackButton href="/normas">Volver a normas</BackButton>
          <NormasPageHeader
            title="Editar norma" 
            icon={<Book className="w-8 h-8 text-[#a57551]" />}
          />
        </div>
        
        <NormForm
          action={action} 
          defaultValues={norma}
          isEditing
        />
      </div>
    </div>
  )
}