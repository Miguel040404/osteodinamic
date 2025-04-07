import Link from "next/link";


export default function Home() {
    return (
        <div className="h-screen grid md:grid-cols-2 place-content-center place-items-center gap-4">
            <div className="text-9xl md:justify-self-end">
                🍕
            </div>
            {/* <div className=" md:justify-self-start">
                <Link href="/repartidores" className="block text-4xl font-bold">REPARTIDORES</Link>
                <Link href="/pedidos" className="block text-4xl font-bold">PEDIDOS</Link>
                <Link href="/pizzas" className="block text-4xl font-bold">PIZZAS</Link>
            </div> */}
        </div>
    );
}
