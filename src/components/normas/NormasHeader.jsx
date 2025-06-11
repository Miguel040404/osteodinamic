import Link from 'next/link';
import { PlusIcon, BookText } from 'lucide-react';


export const NormasHeader = ({ normas, session }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#4d4037] flex items-center gap-3">
                <BookText className="w-8 h-8 text-[#a57551]" />
                Normas
            </h1>
            <p className="text-[#7b6b5d] mt-1">
                {normas.length} norma{normas.length !== 1 ? 's' : ''}
            </p>
        </div>

        {session.user.role === 'ADMIN' && (
            <Link href="/normasAdmin">
                <button className="cursor-pointer flex items-center gap-2 bg-[#a57551] hover:bg-[#8f6043] text-white px-4 py-2.5 rounded-lg transition shadow-sm hover:shadow-md">
                    <PlusIcon className="w-5 h-5" />
                    <span>Nueva Norma</span>
                </button>
            </Link>
        )}
    </div>
);