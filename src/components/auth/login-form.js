//Esta solucion es la vieja

// 'use client'
// import { useActionState, useEffect, useState } from 'react';
// import { login } from '@/lib/actions'
// import { toast } from 'sonner';
// import Spinner1 from '@/components/spinner1';
// import { useRouter } from 'next/navigation';


// function LoginForm() {
//   const [state, action, pending] = useActionState(login, {})
//   const [token, setToken] = useState(null);
//   const router = useRouter();


//   useEffect(() => {
//     if (state?.success) {
//       toast.success(state.success);

//       if (state.token) {
//         localStorage.setItem('token', state.token);
//         setToken(state.token);
//       }

//       const redirectTo = globalThis.callbackUrl || '/home';
//       router.push(redirectTo);
//     }

//     if (state?.error) {
//       toast.error(state.error);
//     }
//   }, [state, router]);


//   return (
//     <div className="w-full flex flex-col justify-center md:justify-start items-center p-4 min-h-[65vh] md:min-h-0">
//       <form action={action} className="w-full flex flex-col gap-10 md:gap-9 p-6 md:p-4 rounded-lg md:mt-10">
//         <div className="flex flex-col gap-2">
//           <label htmlFor="phone" className="text-sm font-medium text-slate-700">Número de teléfono</label>
//           <input
//             id="phone"
//             type="tel"
//             name="phone"
//             placeholder="612345678"
//             pattern="\d{9}"
//             maxLength="9"
//             className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             title="El número de teléfono debe contener exactamente 9 dígitos"
//           />
//         </div>
//         <div className="flex flex-col gap-2">
//           <label htmlFor="password" className="text-sm font-medium text-slate-700">Contraseña</label>
//           <input
//             id="password"
//             type="password"
//             name="password"
//             placeholder="******"
//             className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>
//         <button
//           disabled={pending}
//           className="mt-4 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {pending ? <Spinner1 /> : "Iniciar sesión"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LoginForm;


//Esta solucion hace que no necesite login en actions P. pa Pani y como seria con el token personalizado?

'use client'

import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import Spinner1 from '@/components/spinner1';
import { useState } from 'react';

function LoginForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);
    const phone = form.get('phone');
    const password = form.get('password');

    const callbackUrl = globalThis.callbackUrl || '/home';

    const res = await signIn('credentials', {
      redirect: false,
      phone,
      password,
      callbackUrl,
    });

    setLoading(false);

    if (res?.ok) {
      toast.success("Inicio de sesión correcto");
      window.location.href = res.url || callbackUrl;
    } else {
      toast.error("Credenciales incorrectas o error en el servidor");
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center p-4 min-h-[65vh]">
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-10 p-6 rounded-lg">
        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-sm font-medium text-slate-700">Número de teléfono</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder="612345678"
            pattern="\d{9}"
            maxLength="9"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">Contraseña</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="******"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? <Spinner1 /> : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
