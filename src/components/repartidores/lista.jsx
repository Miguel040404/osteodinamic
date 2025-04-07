import { obtenerRepartidores } from "@/lib/data";
import Link from "next/link";
import Modal from "@/components/modal";
import RepartidorInsertar from "./insertar";
import RepartidorModificar from "./modificar";
import RepartidorEliminar from "./eliminar";
import { auth } from "@/auth";
import { HeadsetIcon, PencilIcon, PhoneIcon, PlusIcon, TrashIcon } from "lucide-react";


export default async function Repartidores() {
    const session = await auth()
    const repartidores = await obtenerRepartidores()


    return (
        <div className="flex flex-col gap-4">
            {session?.user.role === 'ADMIN' &&
                <Modal openElement={
                    <div className='justify-self-end size-8 grid place-content-center rounded-full border border-green-500 text-green-700 bg-green-200 hover:bg-green-500 hover:text-white hover:cursor-pointer'>
                        <PlusIcon className='size-4' />
                    </div>}>
                    <RepartidorInsertar />
                </Modal>
            }

            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">

                {repartidores.map(repartidor =>
                    <div key={repartidor.id} className="p-4 mb-4 bg-blue-50 rounded-lg border border-blue-100   ">

                        <div className='flex justify-end items-center gap-1'>
                            <Modal openElement={
                                <div className='size-8 grid place-content-center rounded-full border border-amber-500 text-amber-700 bg-amber-200 hover:bg-amber-500 hover:text-white hover:cursor-pointer'>
                                    <PencilIcon className='size-4' />
                                </div>}>
                                <RepartidorModificar repartidor={repartidor} />
                            </Modal>


                            <Modal openElement={
                                <div className='size-8 grid place-content-center rounded-full border border-red-500 text-red-700 bg-red-200 hover:bg-red-500 hover:text-white hover:cursor-pointer'>
                                    <TrashIcon className='size-4' />
                                </div>}>
                                <RepartidorEliminar repartidor={repartidor} />
                            </Modal>
                        </div>


                        <Link href={`/repartidores/${repartidor.id}`} className="font-bold cursor-pointer">
                            {repartidor.nombre}
                        </Link>
                        <a href={`tel:${repartidor.telefono}`} className="flex gap-2 p-2 bg-blue-100">
                            <HeadsetIcon /> {repartidor.telefono}
                        </a>

                    </div>
                )}
            </div>
        </div>
    );
}