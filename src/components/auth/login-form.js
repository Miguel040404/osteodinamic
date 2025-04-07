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
        <form action={action} className='flex flex-col gap-4 py-4'>
            <div>
                <label>Email</label>
                <input type='email' name='email' placeholder="name@mail.com" className='w-full p-3' />
            </div>
            <div>
                <label>Contraseña</label>
                <input type="password" name='password' placeholder="******" className='w-full p-3' />
            </div>

            <button
                disabled={pending}
                className="px-8 py-4 bg-blue-500 text-white cursor-pointer hover:font-bold" >
                {pending ? <Spinner1 /> : "Iniciar sesión"}
            </button>
        </form>

    );
};

export default LoginForm;