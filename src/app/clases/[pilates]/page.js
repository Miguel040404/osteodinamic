// import ListaHorarios from "@/components/horarios/lista";
// import { Suspense } from "react";

// export default function ClasePage({ params }) {

//   return (
//     <div>
//       <h1>Lista de clases de pilates</h1>

//       <Suspense fallback={<div>Cargando horarios...</div>}>
//         <ListaHorarios tipo="Pilates" />
//       </Suspense>
//     </div>);
// }

import ListaHorarios from "@/components/horarios/lista";
import { Suspense } from "react";

export default function ClasePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Lista de clases de Pilates</h1>
      <Suspense fallback={<p>Cargando horarios...</p>}>
        <ListaHorarios tipo="Pilates" />
      </Suspense>
    </div>
  );
}
