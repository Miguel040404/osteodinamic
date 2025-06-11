import { Suspense } from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getClassCounts, getNotViewedNotificationsCountByUserId } from '@/lib/data';
import { HomeLayout } from '@/components/home/HomeLayout';
import { HomeContent } from '@/components/home/HomeContent';
import { LoadingSpinner } from '@/components/LoadingSpinner';


async function HomePage() {
  const session = await auth();
  if (!session) return redirect('/auth/login');

  const [notifications, classCounts] = await Promise.all([
    getNotViewedNotificationsCountByUserId(session.user.id),
    getClassCounts()
  ]);

  return (
    <HomeLayout>
      <HomeContent
        classCounts={classCounts}
        notificationCount={notifications}
      />
    </HomeLayout>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomePage />
    </Suspense>
  );
}