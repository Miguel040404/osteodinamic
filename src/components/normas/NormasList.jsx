import { BookText } from 'lucide-react';
import { NormaItem } from './NormalItem';


export const NormasList = ({ normas, session, onDelete }) => (
    <div className="space-y-6">
        {normas.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm p-8 border border-[#b9b59c]">
                <div className="bg-[#e8d7c3] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <BookText className="w-8 h-8 text-[#a57551]" />
                </div>
                <h3 className="text-xl font-medium text-[#4d4037]">No hay normas</h3>
                <p className="text-[#7b6b5d] mt-2">No se han publicado normas aún</p>
            </div>
        ) : (
            normas.map((norma) => (
                <NormaItem key={norma.id} norma={norma} session={session} onDelete={onDelete} />
            ))
        )}
    </div>
);