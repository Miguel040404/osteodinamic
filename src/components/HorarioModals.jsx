'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import Modal from './modal'
import { crearHorario, editarHorario, eliminarHorario } from '@/lib/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'; // Importa useRouter

// Icons for better visual cues
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
)

const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
)

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
)

const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
)

export function CrearHorarioModal({ tipo }) {
    const modalRef = useRef()
    const formRef = useRef()
    const [state, formAction, isPending] = useActionState(crearHorario, null)

    useEffect(() => {
        if (state?.success) {
            modalRef.current?.closeModal()
            formRef.current?.reset()
            toast.success('Horario creado exitosamente!')
        }
    }, [state])

    return (
        <Modal
            ref={modalRef}
            title="Crear nuevo horario"
            openElement={
                <button className="flex items-center gap-2 bg-[#6B4F3B] text-[#FAF3EB] px-4 py-2.5 rounded-lg shadow-md transition-all transform hover:scale-105 cursor-pointer">
                    <PlusIcon />
                    <span>Nuevo Horario</span>
                </button>
            }
        >
            <form ref={formRef} action={formAction} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#4B3A2B] mb-1">
                            Día de la semana:
                        </label>
                        <select
                            name="dia"
                            className="w-full px-4 py-2.5 border border-[#A38D79] bg-[#F9F4EF] text-[#4B3A2B] rounded-lg focus:ring-2 focus:ring-[#BFA88F] focus:border-transparent transition-colors"
                            required
                            defaultValue=""
                        >
                            <option value="" disabled>Selecciona un día</option>
                            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#4B3A2B] mb-1">
                            Hora de la sesión:
                        </label>
                        <select
                            name="hora"
                            className="w-full px-4 py-2.5 border border-[#A38D79] bg-[#F9F4EF] text-[#4B3A2B] rounded-lg focus:ring-2 focus:ring-[#BFA88F] focus:border-transparent transition-colors"
                            required
                            defaultValue=""
                        >
                            <option value="" disabled>Selecciona una hora</option>
                            {[
                                "08:00", "09:00", "10:00", "11:00",
                                "12:00", "13:00", "14:00", "15:00",
                                "16:00", "17:00", "18:00", "19:00",
                                "20:00", "21:00"
                            ].map((hora) => (
                                <option key={hora} value={hora}>{hora}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#4B3A2B] mb-1">
                            Sala de la sesión:
                        </label>
                        <select
                            name="sala"
                            className="w-full px-4 py-2.5 border border-[#A38D79] bg-[#F9F4EF] text-[#4B3A2B] rounded-lg focus:ring-2 focus:ring-[#BFA88F] focus:border-transparent transition-colors"
                            required
                            defaultValue=""
                        >
                            <option value="" disabled>Selecciona una sala</option>
                            <option value="Sala 1">Sala 1</option>
                            <option value="Sala 2">Sala 2</option>
                        </select>
                    </div>
                </div>

                <input type="hidden" name="tipo" value={tipo} />

                <div className="space-y-3">
                    <button
                        type="submit"
                        disabled={isPending}
                        className={`cursor-pointer w-full flex justify-center items-center py-3 px-4 rounded-lg font-medium shadow-md transition-all transform ${
                            isPending
                                ? 'bg-[#BFA88F] text-[#FAF3EB] cursor-not-allowed'
                                : 'bg-[#6B4F3B] text-[#FAF3EB] hover:scale-105'
                        }`}
                    >
                        {isPending ? (
                            <>
                                <Spinner />
                                Creando...
                            </>
                        ) : 'Crear Horario'}
                    </button>

                    {state?.error && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center animate-fade-in">
                            {state.error}
                        </div>
                    )}
                </div>
            </form>
        </Modal>
    )
}


export function EditarHorarioModal({ horario }) {
    const modalRef = useRef();
    const formRef = useRef();
    const [state, formAction, isPending] = useActionState(editarHorario, null);

    useEffect(() => {
        if (state?.success) {
            modalRef.current?.closeModal();
            formRef.current?.reset();
            toast.success('Horario modificado exitosamente!');
        }
    }, [state]);

    return (
        <Modal
            ref={modalRef}
            title="Editar horario"
            openElement={
                <button className="flex items-center gap-1 bg-[#6B4F3B] hover:bg-[#5A4030] text-white px-3 py-1.5 rounded-lg shadow-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <span>Editar</span>
                </button>
            }
        >
            <form ref={formRef} action={formAction} className="space-y-6">
                <input type="hidden" name="horarioId" value={horario.id} />

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#4B3A2B] mb-1">
                            Día de la semana:
                        </label>
                        <select
                            name="dia"
                            defaultValue={horario.dia}
                            className="w-full px-4 py-2.5 border border-[#A38D79] bg-[#F9F4EF] text-[#4B3A2B] rounded-lg focus:ring-2 focus:ring-[#BFA88F] focus:border-transparent transition-colors"
                            required
                        >
                            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#4B3A2B] mb-1">
                            Hora de la sesión:
                        </label>
                        <select
                            name="hora"
                            defaultValue={horario.hora}
                            className="w-full px-4 py-2.5 border border-[#A38D79] bg-[#F9F4EF] text-[#4B3A2B] rounded-lg focus:ring-2 focus:ring-[#BFA88F] focus:border-transparent transition-colors"
                            required
                        >
                            {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"].map(h => (
                                <option key={h} value={h}>{h}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#4B3A2B] mb-1">
                            Sala de la sesión:
                        </label>
                        <select
                            name="sala"
                            defaultValue={horario.sala}
                            className="w-full px-4 py-2.5 border border-[#A38D79] bg-[#F9F4EF] text-[#4B3A2B] rounded-lg focus:ring-2 focus:ring-[#BFA88F] focus:border-transparent transition-colors"
                            required
                        >
                            {['Sala 1', 'Sala 2'].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className={`cursor-pointer w-full flex justify-center items-center py-2.5 px-4 rounded-lg font-medium text-white shadow-md transition-all ${
                        isPending
                            ? 'bg-[#C4B2A2] cursor-not-allowed'
                            : 'bg-[#6B4F3B] hover:bg-[#5A4030]'
                    }`}
                >
                    {isPending ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Guardando...
                        </>
                    ) : 'Guardar Cambios'}
                </button>

                {state?.error && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center">
                        {state.error}
                    </div>
                )}
            </form>
        </Modal>
    );
}

export function EliminarHorarioModal({ horarioId }) {
    const router = useRouter();
    const modalRef = useRef();
    const formRef = useRef();
    const [state, formAction, isPending] = useActionState(eliminarHorario, null);

    // En EditarHorarioModal
    useEffect(() => {
        if (state?.success) {
            modalRef.current?.closeModal();
            formRef.current?.reset();
            toast.success('Horario eliminado correctamente');

            // Preferible si estás usando App Router con SSR o ISR
            setTimeout(() => {
                router.refresh(); // en lugar de window.location.reload()
            }, 300);
        }
    }, [state]);

    return (
        <Modal
            ref={modalRef}
            title="Eliminar horario"
            openElement={
                <button className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-3 py-1.5 rounded-lg shadow-md cursor-pointer">
                    <TrashIcon className="h-5 w-5" />
                    <span>Eliminar</span>
                </button>
            }
        >
            <form ref={formRef} action={formAction} className="space-y-6">
                <input type="hidden" name="horarioId" value={horarioId} />

                <div className="text-center py-4 *:">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">¿Eliminar horario?</h3>
                    <p className="text-gray-500">
                        Esta acción es permanente y no se puede deshacer.
                    </p>
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        type="button"
                        onClick={() => modalRef.current?.closeModal()}
                        className="px-4 py-2.5 bg-amber-950 text-white border hover:bg-amber-800 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className={`px-4 py-2.5 rounded-lg text-white shadow-md transition-all cursor-pointer ${isPending
                            ? 'bg-red-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
                            }`}
                    >
                        {isPending ? (
                            <span className="flex items-center gap-2">
                                <Spinner />
                                Eliminando...
                            </span>
                        ) : 'Confirmar eliminación'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}