import { Suspense } from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Footer from '@/components/Footer';
import prisma from '@/lib/prisma';
import { NotificacionesHeader } from '@/components/notificaciones/NotificationHeader';
import { NotificacionesList } from '@/components/notificaciones/NotificationList';
import { LoadingSpinner } from '@/components/LoadingSpinner';

async function NotificacionesContent() {
  const session = await auth();
  if (!session) redirect('/auth/login');

  const notificaciones = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
    include: { viewed: true }
  });

  return (
    <div className="min-h-screen bg-[#f9faf5]">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <NotificacionesHeader notificaciones={notificaciones} session={session} />
        <NotificacionesList notificaciones={notificaciones} session={session} />
        <div className="mt-12">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default function NotificacionesPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <NotificacionesContent />
    </Suspense>
  );
}