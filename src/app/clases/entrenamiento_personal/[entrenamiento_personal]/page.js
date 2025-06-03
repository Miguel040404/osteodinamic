
import Footer from "@/components/footer";
import ListaHorarios from "@/components/horarios/lista";
import { Suspense } from "react";

// Componente para el spinner de carga
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

export default function ClasePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<LoadingSpinner />}>
          <ListaHorarios tipo="Entrenamiento_personal" />
        </Suspense>
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

// export default function ClasePage() {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <Suspense fallback={
//           <div className="min-h-screen flex items-center justify-center">
//             <p className="text-lg">Cargando horarios...</p>
//           </div>
//         }>
//           <ListaHorarios tipo="Entrenamiento_personal" />
//         </Suspense>
//       </main>

//       <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <Footer />
//       </div>
//     </div>
//   );
// }