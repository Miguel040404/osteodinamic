'use client'

import Modal from '@/components/modal'
import UserModificar from '@/components/users/modificar'

export default function EditarPerfilButton({ user }) {
  return (
    <Modal 
      openElement={
        <button className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded hover:bg-amber-200">
          Editar perfil
        </button>
      }
    >
      <UserModificar user={user} />
    </Modal>
  )
}