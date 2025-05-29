'use client';



export default function Header() {
 

  return (
    <header className='bg-[rgb(41,54,66)] text-white p-4 shadow-lg w-full flex justify-between items-center'>
      {/* Logo y título */}
      <div className="flex items-center">
        <a href="/home" className="flex items-center hover:opacity-90 transition-opacity">
          <div className="bg-white rounded-full p-1 mr-3 shadow-md">
            <img 
              src="/images/logo.png" 
              alt="Logo de la aplicación" 
              width={60} 
              className="rounded-full"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Osteodinamic</h1>
            <p className="text-xs text-blue-200 mt-1">Salud Integrativa</p>
          </div>
        </a>
      </div>

      {/* Perfil de usuario */}
  
    </header>
  );
}

// 'use client';

// import React from 'react';
// import { useSession } from 'next-auth/react';

// export default function Header() {
//   const { data: session } = useSession();

//   return (
//     <header className='bg-[rgb(41,54,66)] text-white p-2 shadow-md w-full flex justify-between'>
//       <div className="flex items-center justify-center md:justify-start ml-[-1rem]">
//         <a href="/home">
//           <img src="/images/logo.png" alt="Logo de la aplicación" width={80} />
//         </a>
//         <div className="text-center ml-4">
//           <h1 className="text-2xl font-[Montserrat] md:ml-0 ml-[-1rem]">Osteodinamic</h1>
//           {/* <h2 className="text-sm">Salud Integrativa</h2> */}
//         </div>
//       </div>
//       {session && (
//         <div className="flex items-center justify-center">
//           <img
//             src={session.user.image}
//             alt="Imagen del usuario"
//             className="rounded-full w-10 h-10"
//           />
//         </div>
//       )}
//     </header>
//   );
// }
