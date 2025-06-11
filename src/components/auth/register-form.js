'use client'

import { useActionState, useEffect } from 'react';
import { register } from '@/lib/actions';
import Spinner1 from '@/components/Spinner1';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function RegisterForm() {
    const [state, action, pending] = useActionState(register, {});
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            toast.success(state.success);
            router.push('/perfil');
        }
        if (state?.error) toast.error(state.error);
    }, [state, router]);

    return (
        <form action={action} className="flex flex-col gap-5 py-6">
            <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-sm font-medium text-[#5C4033]">Nombre y apellidos</label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Juan"
                    pattern="[a-zA-ZáéíóúÁÉÍÓÚ\s]+"
                    title="Solo se permiten letras, tildes y espacios"
                    className="w-full p-3 border border-[#d2b48c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-[#8B5E3C]"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="address" className="text-sm font-medium text-[#5C4033]">Dirección</label>
                <input
                    id="address"
                    type="text"
                    name="address"
                    placeholder="Calle 123"
                    className="w-full p-3 border border-[#d2b48c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-[#8B5E3C]"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="phone" className="text-sm font-medium text-[#5C4033]">Número de teléfono</label>
                <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="612345678"
                    pattern="\d{9}"
                    maxLength="9"
                    className="w-full p-3 border border-[#d2b48c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-[#8B5E3C]"
                    title="El número de teléfono debe contener exactamente 9 dígitos"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-sm font-medium text-[#5C4033]">Contraseña</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="******"
                    className="w-full p-3 border border-[#d2b48c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-[#8B5E3C]"
                />
            </div>

            <button
                disabled={pending}
                className="mt-2 px-6 py-3 rounded-lg bg-[#8B5E3C] text-white font-medium hover:bg-[#7A4E30] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {pending ? <Spinner1 /> : "Crear cuenta"}
            </button>
        </form>
    );
};

export default RegisterForm;