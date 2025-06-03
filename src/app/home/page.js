import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { getClassCounts } from "@/lib/actions";
import Image from "next/image";
import { Suspense } from "react"; // Importamos Suspense

// Componente para el spinner de carga
const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-80">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-lg text-gray-600 flex justify-center">
        Cargando clases
        <span className="flex">
          <span className="animate-bounce">.</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
        </span>
      </p>
    </div>
  </div>
);

// Componente principal envuelto en Suspense
function MainContent() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomeContent />
    </Suspense>
  );
}

// Componente que contiene el contenido asíncrono
async function HomeContent() {
  // Fetch class counts from database
  const classCounts = await getClassCounts();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-indigo-50">
      <Header />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-gray-600 mt-2">Descubre nuestras clases disponibles</p>
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
              <div className="absolute inset-0">
                <Image
                  src="/images/PILATES-scaled.jpg"
                  alt="Pilates"
                  layout="fill"
                  objectFit="cover"
                  className="transition-all duration-500 group-hover:scale-110 group-hover:blur-sm"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-red-900 to-red-600 opacity-80 transition-opacity duration-300 group-hover:opacity-70" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Pilates</h2>
                <div className="flex justify-between items-center">
                  <span className="bg-red-500 bg-opacity-70 px-3 py-1 rounded-full text-sm">
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
              <div className="absolute inset-0">
                <Image
                  src="/images/rehabilitacion.jpg"
                  alt="Rehabilitación Funcional"
                  layout="fill"
                  objectFit="cover"
                  className="transition-all duration-500 group-hover:scale-110 group-hover:blur-sm"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-green-900 to-green-600 opacity-80 transition-opacity duration-300 group-hover:opacity-70" />
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
              <div className="absolute inset-0">
                <Image
                  src="/images/entrenamiento.jpg"
                  alt="Entrenamiento Personal"
                  layout="fill"
                  objectFit="cover"
                  className="transition-all duration-500 group-hover:scale-110 group-hover:blur-sm"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-blue-600 opacity-80 transition-opacity duration-300 group-hover:opacity-70" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Entrenamiento Personal</h2>
                <div className="flex justify-between items-center">
                  <span className="bg-blue-500 bg-opacity-70 px-3 py-1 rounded-full text-sm">
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
              <h3 className="!text-gray-700 font-semibold mb-2">Elige tu clase</h3>
              <p className="text-gray-600 text-sm">Selecciona entre nuestras diversas opciones de clases disponibles</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                <span className="text-indigo-600 text-2xl font-bold">2</span>
              </div>
              <h3 className="!text-gray-700 font-semibold mb-2">Reserva tu horario</h3>
              <p className="text-gray-600 text-sm">Selecciona el día y hora que mejor se adapte a tu agenda</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                <span className="text-indigo-600 text-2xl font-bold">3</span>
              </div>
              <h3 className="!text-gray-700 font-semibold mb-2">Disfruta tu clase</h3>
              <p className="text-gray-600 text-sm">Asiste a tu clase y mejora tu bienestar con nuestros expertos</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function Home() {
  return <MainContent />;
}
