import ListaHorarios from "@/components/horarios/lista";
import { Suspense } from "react";

export default function ClasePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Lista de clases de Entrenamiento personal</h1>
      <Suspense fallback={<p>Cargando horarios...</p>}>
        <ListaHorarios tipo="Entrenamiento_personal" />
      </Suspense>
    </div>
  );
}