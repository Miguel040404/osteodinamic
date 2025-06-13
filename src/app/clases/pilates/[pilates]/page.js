import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import ListaHorarios from '@/components/horarios/HorarioList';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { auth } from '@/auth';
import Footer from '@/components/Footer';
import { hasPaidSession } from '@/lib/data';


export default async function ClasePage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/login');
  }

  const hasAccess = await hasPaidSession(session.user.id, 'Pilates');

  return (
    <div className="min-h-screen flex flex-col bg-[#f9faf5]">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
        {hasAccess ? (
          <Suspense fallback={<LoadingSpinner />}>
            <ListaHorarios tipo="Pilates" />
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