'use client'
import { useActionState, useEffect } from 'react';
import { register } from '@/lib/actions'
import Spinner1 from '@/components/spinner1';
import { toast } from 'sonner';


function RegisterForm() {
    const [state, action, pending] = useActionState(register, {})

    useEffect(() => {
        if (state?.success) toast.success(state.success)
        if (state?.error) toast.error(state.error)
    }, [state])

    return (
        <form action={action} className='flex flex-col gap-4 py-4'>
            <div>
                <label>Nombre</label>
                <input type='text' name='name' placeholder="José García" className='w-full p-3' />
            </div>
            <div>
                <label>Email</label>
                <input type='email' name='email' placeholder="jose@mail.com" className='w-full p-3' />
            </div>
            <div>
                <label>Contraseña</label>
                <input type="password" name='password' placeholder="******" className='w-full p-3' />
            </div>
            {/* <p className={`info ${tipo}`}> {resultado} </p> */}
            <button
                disabled={pending}
                className="px-8 py-4 bg-blue-500 text-white cursor-pointer hover:font-bold" >
                {pending ? <Spinner1 /> : "Crear cuenta"}
            </button>
        </form>


    );
};

export default RegisterForm;