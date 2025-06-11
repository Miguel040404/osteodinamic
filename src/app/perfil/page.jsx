import { Suspense } from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from "@/lib/prisma";
import Footer from '@/components/Footer';
import { PerfilCard } from '@/components/perfil/PerfilCard';
import { UsersList } from '@/components/perfil/UsersList';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PerfilActions } from '@/components/perfil/PerfilActions';


async function PerfilData() {
  const session = await auth();

  if (!session) {
    redirect('/auth/login');
  }

  const user = session.user;

  const usuario = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      paidSessions: true
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f9faf5]">
      <main className="flex-1 container mx-auto px-4 py-10">
        <PerfilCard user={usuario} />
        {user.role === 'ADMIN' && <UsersList />}
        <PerfilActions />
      </main>
      <Footer />
    </div>
  );
}

function PerfilContent() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PerfilData />
    </Suspense>
  );
}

export default function Perfil() {
  return <PerfilContent />;
}