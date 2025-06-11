import { Suspense } from 'react';

import { redirect } from 'next/navigation';

import ListaHorarios from '@/components/horarios/HorarioList';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { auth } from '@/auth';
import Footer from '@/components/footer';


export default async function ClasePage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
        <Suspense fallback={<LoadingSpinner />}>
          <ListaHorarios tipo="Entrenamiento_personal" />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
