import { obtenerPedido } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function Pedido({ id }) {
    const pedido = await obtenerPedido(id)
    if (!pedido) notFound()

    return (
        <>
            <div>
                {new Date(pedido.fecha_hora).toLocaleString()}
            </div>
            <div>Nombre del cliente: {pedido.nombre_cliente}</div>
            <div>Dirección del cliente: {pedido.direccion_cliente}</div>

            <div>
                <p className="font-bold text-xl">Repartidor</p>
                {pedido.repartidor?.nombre}
            </div>

            <div>
                <p className="font-bold text-xl">Pizzas</p>
                {pedido.pizzas?.map(pizza =>
                    <p key={pizza.id}>{pizza.nombre}</p>
                )}
            </div>
        </>
    );
}

