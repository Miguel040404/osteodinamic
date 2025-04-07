import { obtenerPizzas } from "@/lib/data";
import Modal from "@/components/modal";
import PizzaVer from "@/components/pizzas/ver";
import PizzaInsertar from "@/components/pizzas/insertar";
import PizzaModificar from "@/components/pizzas/modificar";
import PizzaEliminar from "@/components/pizzas/eliminar";
import { auth } from "@/auth";
import { ArrowUpRightIcon, EyeIcon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";



export default async function Pizzas() {
    const session = await auth()
    const pizzas = await obtenerPizzas()


    return (
        <div className="flex flex-col gap-4">
            {session?.user.role === 'ADMIN' &&
                <Modal openElement={
                    <div className='justify-self-end size-8 grid place-content-center rounded-full border border-green-500 text-green-700 bg-green-200 hover:bg-green-500 hover:text-white hover:cursor-pointer'>
                        <PlusIcon className='size-4' />
                    </div>}>
                    <PizzaInsertar />
                </Modal>
            }

            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                {pizzas
                    .sort((a, b) => a.nombre.localeCompare(b.nombre))
                    .map(pizza =>
                        <div key={pizza.id} className="p-4 mb-4 bg-[#dafb6f]/20 rounded-lg border border-lime-200">


                            <div className='flex justify-end items-center gap-1'>
                                {session?.user.role === 'ADMIN' &&
                                    <>
                                        <Modal openElement={
                                            <div className='size-8 grid place-content-center rounded-full border border-amber-500 text-amber-700 bg-amber-200 hover:bg-amber-500 hover:text-white hover:cursor-pointer'>
                                                <PencilIcon className='size-4' />
                                            </div>}>
                                            <PizzaModificar pizza={pizza} />
                                        </Modal>

                                        <Modal openElement={
                                            <div className='size-8 grid place-content-center rounded-full border border-red-500 text-red-700 bg-red-200 hover:bg-red-500 hover:text-white hover:cursor-pointer'>
                                                <TrashIcon className='size-4' />
                                            </div>}>
                                            <PizzaEliminar pizza={pizza} />
                                        </Modal>
                                    </>
                                }
                                <Link href={`/pizzas/${pizza.id}`} className="text-sm font-bold cursor-pointer">
                                    <div className='size-8 grid place-content-center rounded-full border border-blue-500 text-blue-700 bg-blue-200 hover:bg-blue-500 hover:text-white hover:cursor-pointer'>
                                        <ArrowUpRightIcon className='size-4' />
                                    </div>
                                </Link>
                            </div>

                            <Modal openElement={
                                <div className="grid place-content-center cursor-pointer">
                                    <img src={pizza.foto || '/images/default-pizza.avif'} alt='foto' className="py-6" />
                                    <p className="font-bold text-lg ">{pizza.nombre}</p>
                                    <p className="font-bold text-right text-4xl text-stone-400">{pizza.precio} €</p>
                                </div>}>

                                <PizzaVer pizza={pizza} />
                            </Modal>




                        </div>

                    )}
            </div>

        </div>
    );
}