import ListaHorarios from "@/components/horarios/lista";
import { Suspense } from "react";

export default function ClasePage({ params }) {

  return (
    <div>
      <h1>Lista de clases de pilates</h1>

      <Suspense fallback={<div>Cargando horarios...</div>}>
        <ListaHorarios tipo="Pilates" />
      </Suspense>
    </div>);
}