'use client'
import { useActionState, useEffect } from 'react';
import { login } from '@/lib/actions'
import { toast } from 'sonner';
import Spinner1 from '@/components/spinner1';


function LoginForm() {
    const [state, action, pending] = useActionState(login, {})

    useEffect(() => {
        if (state?.success) toast.success(state.success)
        if (state?.error) toast.error(state.error)
    }, [state])

    return (
        <form action={action} className="flex flex-col gap-5 py-6">

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
                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <button
                disabled={pending}
                className={`mt-4 px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {pending ? <Spinner1 /> : "Iniciar sesión"}
            </button>
        </form>


    );
};

export default LoginForm;