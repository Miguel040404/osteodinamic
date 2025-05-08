// components/EditarPerfilButton.jsx
'use client'

export default function EditarPerfilButton() {
  return (
    <button
      onClick={() => document.getElementById('editarPerfil').showModal()}
      className="absolute top-4 right-4 text-sm text-blue-600 hover:underline"
    >
      Editar perfil
    </button>
  );
}
