import Link from 'next/link';
import { PencilIcon, TrashIcon, BookText, ClockIcon } from 'lucide-react';


export const NormaItem = ({ norma, session, onDelete }) => (
    <div className="bg-[#f5e19106] border border-[#b9b59c] rounded-xl shadow-sm hover:shadow-md transition">
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-[#e8d7c3] p-2 rounded-lg">
                            <BookText className="w-5 h-5 text-[#a57551]" />
                        </div>
                        <h2 className="text-xl font-semibold text-[#4d4037]">{norma.titulo}</h2>
                    </div>
                    <p className="text-[#4d4037] mt-3">{norma.contenido}</p>
                    <div className="flex items-center gap-4 mt-4 text-sm text-[#7b6b5d]">
                        <div className="flex items-center gap-2">
                            <ClockIcon className="w-4 h-4" />
                            <span>{new Date(norma.creadaEn).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                
                {session.user.role === 'ADMIN' && (
                    <div className="flex flex-col gap-3 min-w-[120px]">
                        <Link href={`/normasAdmin/${norma.id}/editar`}>
                            <button className="cursor-pointer flex items-center gap-2 bg-white border border-[#b9b59c] text-[#4d4037] hover:bg-[#f3ece3] w-full px-3 py-2 rounded-lg transition-colors">
                                <PencilIcon className="w-4 h-4" />
                                <span>Editar</span>
                            </button>
                        </Link>
                        <form action={onDelete} className="w-full">
                            <input type="hidden" name="id" value={norma.id} />
                            <button
                                type="submit"
                                className="cursor-pointer flex items-center gap-2 bg-white border border-[#b9b59c] text-red-600 hover:bg-red-50 w-full px-3 py-2 rounded-lg transition-colors"
                            >
                                <TrashIcon className="w-4 h-4" />
                                <span>Eliminar</span>
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    </div>
);