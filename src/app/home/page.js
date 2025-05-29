import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { getClassCounts } from "@/lib/actions";

export default async function Home() {
  // Fetch class counts from database
  const classCounts = await getClassCounts();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-indigo-50">
      <Header />
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            {/* <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Elige una clase</h1> */}
            <p className="text-gray-500 mt-2">Descubre nuestras clases disponibles</p>
          </div>
          <Link href="/notificaciones">
            <button className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-colors shadow-md hover:shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Notificaciones
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pilates Card */}
          <Link href="/clases/pilates/pilates">
            <div className="group relative h-64 rounded-2xl overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105">
              {/* Background Image with Blur Effect */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549060279-7e168fce7090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center transition-all duration-500 group-hover:scale-110 group-hover:blur-sm" />
              
              {/* Color Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-800 to-blue-600 opacity-80 transition-opacity duration-300 group-hover:opacity-70" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Pilates</h2>
                <div className="flex justify-between items-center">
                  <span className="bg-blue-500 bg-opacity-70 px-3 py-1 rounded-full text-sm">
                    {classCounts.pilates} clases disponibles
                  </span>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="mr-1">Ver</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Rehabilitación Funcional Card */}
          <Link href="/clases/rehabilitacion_funcional/rehabilitacion_funcional">
            <div className="group relative h-64 rounded-2xl overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center transition-all duration-500 group-hover:scale-110 group-hover:blur-sm" />
              <div className="absolute inset-0 bg-gradient-to-t from-green-800 to-green-600 opacity-80 transition-opacity duration-300 group-hover:opacity-70" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Rehabilitación Funcional</h2>
                <div className="flex justify-between items-center">
                  <span className="bg-green-500 bg-opacity-70 px-3 py-1 rounded-full text-sm">
                    {classCounts.rehabilitacion_funcional} clases disponibles
                  </span>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="mr-1">Ver</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Entrenamiento Personal Card */}
          <Link href="/clases/entrenamiento_personal/entrenamiento_personal">
            <div className="group relative h-64 rounded-2xl overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center transition-all duration-500 group-hover:scale-110 group-hover:blur-sm" />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-800 to-purple-600 opacity-80 transition-opacity duration-300 group-hover:opacity-70" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Entrenamiento Personal</h2>
                <div className="flex justify-between items-center">
                  <span className="bg-purple-500 bg-opacity-70 px-3 py-1 rounded-full text-sm">
                    {classCounts.entrenamiento_personal} clases disponibles
                  </span>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="mr-1">Ver</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">¿Cómo funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                <span className="text-indigo-600 text-2xl font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Elige tu clase</h3>
              <p className="text-gray-600 text-sm">Selecciona entre nuestras diversas opciones de clases disponibles</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                <span className="text-indigo-600 text-2xl font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Reserva tu horario</h3>
              <p className="text-gray-600 text-sm">Selecciona el día y hora que mejor se adapte a tu agenda</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                <span className="text-indigo-600 text-2xl font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Disfruta tu clase</h3>
              <p className="text-gray-600 text-sm">Asiste a tu clase y mejora tu bienestar con nuestros expertos</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// viejo
// import Footer from "@/components/footer";
// import Header from "@/components/header";
// import Link from "next/link";

// export default function Home() {
//   return (
//     <div className="h-s flex flex-col w-full">
//       {/* <Header /> */}
//       <main>
//         <h1 className="text-2xl font-bold">Elige una clase</h1>
//         <div className="flex flex-col gap-4 mt-4">
//           <Link href="/clases/pilates/pilates">
//             <button className="bg-blue-600 text-white px-4 py-2 rounded-xl">Pilates</button>
//           </Link>
//           <Link href="/clases/rehabilitacion_funcional/rehabilitacion_funcional">
//             <button className="bg-green-600 text-white px-4 py-2 rounded-xl">Rehabilitación funcional</button>
//           </Link>
//           <Link href="/clases/entrenamiento_personal/entrenamiento_personal">
//             <button className="bg-purple-600 text-white px-4 py-2 rounded-xl">Entrenamiento personal</button>
//           </Link>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }


// raro
// import Footer from "@/components/footer";
// import Header from "@/components/header";
// import Link from "next/link";

// export default function Home() {
//   return (
//     <div className="min-h-screen flex flex-col w-full bg-gray-50">
//       <Header />
//       <main className="flex-1 container mx-auto p-4 pb-20">
//         <h1 className="text-2xl font-bold mb-6 text-gray-800">Elige una clase</h1>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {/* Tarjeta de Pilates */}
//           <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
//             <div className="relative">
//               <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48" />
//               <div className="absolute top-4 right-4">
               
//               </div>
//             </div>
            
//             <div className="p-5">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-xl font-bold text-gray-800">Pilates</h2>
//                 <Link href="/clases/pilates/pilates">
//                   <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-700 transition-colors">
//                     Ver clase
//                   </button>
//                 </Link>
//               </div>
              
//               {/* Sección desplegable para notificaciones */}
             
//             </div>
//           </div>

//           {/* Tarjeta de Rehabilitación Funcional */}
//           <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
//             <div className="relative">
//               <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48" />
//               <div className="absolute top-4 right-4">
               
//               </div>
//             </div>
            
//             <div className="p-5">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-xl font-bold text-gray-800">Rehabilitación Funcional</h2>
//                 <Link href="/clases/rehabilitacion_funcional/rehabilitacion_funcional">
//                   <button className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-green-700 transition-colors">
//                     Ver clase
//                   </button>
//                 </Link>
//               </div>
              
//               <div className="mt-4">
               
                
//                 <div className="hidden mt-2 border-t pt-2 space-y-2">
//                   <div className="text-sm p-2 bg-green-50 rounded-lg">
//                     Sesión especial con fisioterapeuta invitado
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Tarjeta de Entrenamiento Personal */}
//           <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
//             <div className="relative">
//               <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48" />
//               <div className="absolute top-4 right-4">
              
//               </div>
//             </div>
            
//             <div className="p-5">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-xl font-bold text-gray-800">Entrenamiento Personal</h2>
//                 <Link href="/clases/entrenamiento_personal/entrenamiento_personal">
//                   <button className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-purple-700 transition-colors">
//                     Ver clase
//                   </button>
//                 </Link>
//               </div>
              
//               <div className="mt-4">
               
                
//                 <div className="hidden mt-2 border-t pt-2 space-y-2">
//                   <div className="text-sm p-2 text-gray-500">
//                     No hay notificaciones
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }