// 'use client'

// import { useEffect } from 'react';

// export default function EditarPerfilButton() {
//   useEffect(() => {
//     const button = document.getElementById('editarPerfilButton');
//     if (button) {
//       button.addEventListener('click', handleClick);
//     }
//     return () => {
//       if (button) {
//         button.removeEventListener('click', handleClick);
//       }
//     };
//   }, []);

//   const handleClick = () => {
//     const modal = document.getElementById('editarPerfil');
//     if (modal) {
//       modal.showModal();
//     } else {
//       console.error('Modal not found');
//     }
//   };

//   return (
//     <button
//       onClick={handleClick}
//       className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//     >
//       Editar perfil
//     </button>
//   );
// }

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