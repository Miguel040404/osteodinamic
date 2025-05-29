import Footer from "@/components/footer";
import ListaHorarios from "@/components/horarios/lista";
import { Suspense } from "react";

export default function ClasePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={
          <div className="flex justify-center py-12">
            <p className="text-lg">Cargando horarios...</p>
          </div>
        }>
          <ListaHorarios tipo="Entrenamiento_personal" />
        </Suspense>
      </main>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Footer />
      </div>
    </div>
  );
}