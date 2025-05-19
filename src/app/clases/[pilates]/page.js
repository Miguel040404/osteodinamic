import Header from "@/components/header";
import Footer from "@/components/footer";
import ListaHorarios from "@/components/horarios/lista";
import { Suspense } from "react";

export default function ClasePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Lista de clases de Pilates</h1>
        <Suspense fallback={<p>Cargando horarios...</p>}>
          <ListaHorarios tipo="Pilates" />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
