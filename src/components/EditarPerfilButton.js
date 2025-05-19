'use client'

import { useEffect } from 'react';

export default function EditarPerfilButton() {
  useEffect(() => {
    // Cualquier manipulación del DOM se puede hacer aquí
    // Asegúrate de que el modal esté definido en el DOM
  }, []);

  const handleClick = () => {
    const modal = document.getElementById('editarPerfil');
    if (modal) {
      modal.showModal();
    } else {
      console.error('Modal not found');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Editar perfil
    </button>
  );
}