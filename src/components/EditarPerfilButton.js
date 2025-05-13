'use client'

export default function EditarPerfilButton() {
  return (
    <button
      onClick={() => document.getElementById('editarPerfil').showModal()}
      className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Editar perfil
    </button>
  );
}