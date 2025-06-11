import { Suspense } from 'react';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import Footer from '@/components/Footer';
import { redirect } from 'next/navigation';
import { eliminarNorma } from '@/lib/actions';
import { NormasHeader } from '@/components/normas/NormasHeader';
import { NormasList } from '@/components/normas/NormasList';
import { LoadingSpinner } from '@/components/LoadingSpinner';


async function NormasContent() {
  const session = await auth();
  if (!session) redirect('/auth/login');

  const normas = await prisma.norma.findMany({
    orderBy: { creadaEn: 'desc' },
  });

  return (
    <div className="min-h-screen bg-[#f9faf5]">
      <div className="max-w-4xl mx-auto py-10 px-4">
        <NormasHeader normas={normas} session={session} />
        <NormasList normas={normas} session={session} onDelete={eliminarNorma} />
        <div className="mt-12">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default function NormasPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <NormasContent />
    </Suspense>
  );
}