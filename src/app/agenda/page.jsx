import { getReservasDelUsuario, getTodasReservas, cancelarReserva, cancelarReservaAdmin } from "@/lib/actions";
import { auth } from "@/auth";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { AgendaContent } from "@/components/agenda/AgendaContent";

export default function AgendaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br bg-[#F2F1E8] text-slate-800">
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <Suspense fallback={<LoadingSpinner />}>
          <AgendaContentWrapper />
        </Suspense>
      </main>
      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}

async function AgendaContentWrapper() {
  const session = await auth();

  if (!session) {
    return redirect('/auth/login');
  }

  const userId = session?.user?.id;
  const esAdmin = session?.user?.role === "ADMIN";
  const reservas = esAdmin ? await getTodasReservas() : await getReservasDelUsuario(userId);

  return <AgendaContent reservas={reservas} esAdmin={esAdmin} />;
}