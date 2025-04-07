import { obtenerRepartidor } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function Repartidor({ id }) {
    const repartidor = await obtenerRepartidor(id)
    if (!repartidor) notFound()

    return (
        <>
            <div>Nombre: {repartidor.nombre}</div>
            <div>Teléfono: {repartidor.telefono}</div>
        </>
    );
}

