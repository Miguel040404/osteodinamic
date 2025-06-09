'use client'

import { useActionState, useEffect } from 'react';
import { register } from '@/lib/actions';
import Spinner1 from '@/components/spinner1';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function RegisterForm() {
    const [state, action, pending] = useActionState(register, {});
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            toast.success(state.success);
            // Redirige al perfil después de un registro exitoso
            router.push('/perfil');
        }
        if (state?.error) toast.error(state.error);
    }, [state, router]);

    return (
        <form action={action} className="flex flex-col gap-5 py-6">
            <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-sm font-medium text-slate-700">Nombre y apellidos</label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Juan"
                    pattern="[a-zA-ZáéíóúÁÉÍÓÚ\s]+"
                    title="Solo se permiten letras, tildes y espacios"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="address" className="text-sm font-medium text-slate-700">Direccion</label>
                <input
                    id="address"
                    type="text"
                    name="address"
                    placeholder="Calle 123"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="phone" className="text-sm font-medium text-slate-700">Número de teléfono</label>
                <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="612345678"
                    pattern="\d{9}"
                    maxLength="9"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="El número de teléfono debe contener exactamente 9 dígitos"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">Contraseña</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="******"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                disabled={pending}
                className="mt-2 px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {pending ? <Spinner1 /> : "Crear cuenta"}
            </button>
        </form>
    );
};

export default RegisterForm;