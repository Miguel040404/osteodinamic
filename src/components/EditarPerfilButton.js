'use client'

import Modal from '@/components/modal'

import { Pencil } from 'lucide-react'
import UserModificar from './auth/edit-form'

export default function EditarPerfilButton({ user }) {
  return (
    <Modal 
    title="Editar perfil"
      openElement={
        <button className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 bg-[#4d4037] text-[#f5deb3] rounded-md hover:bg-[#614033] hover: transition-all duration-200 cursor-pointer">
          <Pencil className="h-4 w-4" />
          Editar perfil
        </button>
      }
    >
      <UserModificar user={user} />
    </Modal>
  )
}
