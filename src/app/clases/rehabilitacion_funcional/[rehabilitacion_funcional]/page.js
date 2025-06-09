import Footer from "@/components/footer";
import ListaHorarios from "@/components/horarios/lista";
import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { hasPaidSession } from "@/lib/data";

const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#f9faf5] bg-opacity-80">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#a57551] mx-auto"></div>
      <p className="mt-4 text-lg text-[#4d4037] flex justify-center">
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
  const hasAccess = await hasPaidSession(session.user.id, 'Rehabilitacion_funcional');

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
        {hasAccess ? (
          <Suspense fallback={<LoadingSpinner />}>
            <ListaHorarios tipo="Rehabilitacion_funcional" />
          </Suspense>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Parece que esta sesión no esta habilitada en tu cuentas en este momento.
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Si necesitas más información o ayuda, no dudes en contactarnos.
            </p>
            <a
              href="/home"
              className="bg-[#a57551] hover:bg-[#78493c] text-white font-medium py-2 px-4 rounded-lg transition"
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