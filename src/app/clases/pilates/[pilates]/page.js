import Footer from "@/components/footer";
import ListaHorarios from "@/components/horarios/lista";
import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { hasPaidSession } from "@/lib/data"; 

const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-80">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-lg text-gray-600 flex justify-center">
        Cargando horarios
        <span className="flex">
          <span className="animate-bounce">.</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
        </span>
      </p>
    </div>
  </div>
);

export default async function ClasePage() {
  const session = await auth();
  


  if (!session) {
    return (
     redirect('/auth/login')
    )
  }
  // Verificar acceso (admins siempre tienen acceso)
  const hasAccess = await hasPaidSession(session.user.id, 'Pilates');

  return (
    <div className="min-h-screen flex flex-col bg-[#f9faf5]">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {hasAccess ? (
          <Suspense fallback={<LoadingSpinner />}>
            <ListaHorarios tipo="Pilates" />
          </Suspense>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Sesión no disponible
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              No tienes acceso a los horarios de Pilates porque no has pagado esta sesión.
            </p>
            <a
              href="/home"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition"
            >
             Volver a la página principal
            </a>
          </div>
        )}
      </main>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Footer />
      </div>
    </div>
  );
}


// import Footer from "@/components/footer";
// import ListaHorarios from "@/components/horarios/lista";
// import { Suspense } from "react";

// // Componente para el spinner de carga
// const LoadingSpinner = () => (
//   <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-80">
//     <div className="text-center">
//       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
//       <p className="mt-4 text-lg text-gray-600 flex justify-center">
//         Cargando horarios
//         <span className="flex">
//           <span className="animate-bounce">.</span>
//           <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
//           <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
//         </span>
//       </p>
//     </div>
//   </div>
// );

// export default function ClasePage() {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//        <Suspense fallback={<LoadingSpinner />}>
//           <ListaHorarios tipo="Pilates" />
//         </Suspense>
//       </main>
      
//       <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <Footer />
//       </div>
//     </div>
//   );
// }