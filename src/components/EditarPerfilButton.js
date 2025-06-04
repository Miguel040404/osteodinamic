'use client'

import Modal from '@/components/modal'

import { Pencil } from 'lucide-react'
import UserModificar from './auth/edit-form'

export default function EditarPerfilButton({ user }) {
  return (
    <Modal 
    title="Editar perfil"
      openElement={
        <button className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 bg-teal-100 text-teal-800 rounded-md hover:bg-teal-200 hover: transition-all duration-200">
          <Pencil className="h-4 w-4" />
          Editar perfil
        </button>
      }
    >
      <UserModificar user={user} />
    </Modal>
  )
}
