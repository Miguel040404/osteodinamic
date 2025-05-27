// 'use client'

// import { signIn } from 'next-auth/react';
// import { toast } from 'sonner';
// import Spinner1 from '@/components/spinner1';
// import { useState } from 'react';

// function LoginForm() {
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const form = new FormData(e.target);
//     const phone = form.get('phone');
//     const password = form.get('password');

//     const callbackUrl = globalThis.callbackUrl || '/home';

//     const res = await signIn('credentials', {
//       redirect: false,
//       phone,
//       password,
//       callbackUrl,
//     });

//     setLoading(false);

//     if (res?.ok) {
//       toast.success("Inicio de sesión correcto");
//       window.location.href = res.url || callbackUrl;
//     } else {
//       toast.error("Credenciales incorrectas o error en el servidor");
//     }
//   };

//   return (
//     <div className="w-full flex flex-col justify-center items-center p-4 min-h-[65vh]">
//       <form onSubmit={handleSubmit} className="w-full flex flex-col gap-10 p-6 rounded-lg">
//         <div className="flex flex-col gap-2">
//           <label htmlFor="phone" className="text-sm font-medium text-slate-700">Número de teléfono</label>
//           <input
//             id="phone"
//             type="tel"
//             name="phone"
//             placeholder="612345678"
//             pattern="\d{9}"
//             maxLength="9"
//             className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500"
//             required
//           />
//         </div>

//         <div className="flex flex-col gap-2">
//           <label htmlFor="password" className="text-sm font-medium text-slate-700">Contraseña</label>
//           <input
//             id="password"
//             type="password"
//             name="password"
//             placeholder="******"
//             className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-400"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="mt-4 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:opacity-50"
//         >
//           {loading ? <Spinner1 /> : "Iniciar sesión"}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default LoginForm;


// Funka regular
// 'use client'

// import { signIn } from 'next-auth/react';
// import { toast } from 'sonner';
// import Spinner1 from '@/components/spinner1';
// import { useState } from 'react';

// function LoginForm() {
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const form = new FormData(e.target);
//     const phone = form.get('phone');
//     const password = form.get('password');

//     const callbackUrl = globalThis.callbackUrl || '/home';

//     const res = await signIn('credentials', {
//       redirect: false,
//       phone,
//       password,
//       callbackUrl,
//     });

//     setLoading(false);

//     if (res?.ok) {
//       toast.success("Inicio de sesión correcto");
//       window.location.href = res.url || callbackUrl;
//       console.log("funciona");
//     } else {
//       console.log("no funciona");
//       toast.error("Credenciales incorrectas o error en el servidor");
//     }
//   };

//   return (
//     <div className="w-full flex flex-col justify-center items-center p-4 min-h-[65vh]">
//       <form onSubmit={handleSubmit} className="w-full flex flex-col gap-10 p-6 rounded-lg">
//         <div className="flex flex-col gap-2">
//           <label htmlFor="phone" className="text-sm font-medium text-slate-700">Número de teléfono</label>
//           <input
//             id="phone"
//             type="tel"
//             name="phone"
//             placeholder="612345678"
//             pattern="\d{9}"
//             maxLength="9"
//             className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500"
//             required
//           />
//         </div>

//         <div className="flex flex-col gap-2">
//           <label htmlFor="password" className="text-sm font-medium text-slate-700">Contraseña</label>
//           <input
//             id="password"
//             type="password"
//             name="password"
//             placeholder="******"
//             className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-400"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="mt-4 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:opacity-50"
//         >
//           {loading ? <Spinner1 /> : "Iniciar sesión"}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default LoginForm;

'use client'

import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import Spinner1 from '@/components/spinner1';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/home';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const credentials = Object.fromEntries(formData);

      const res = await signIn('credentials', {
        redirect: false,
        ...credentials,
        callbackUrl,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      toast.success("¡Bienvenido!");
      window.location.href = res?.url || callbackUrl;
      
    } catch (error) {
      toast.error(
        error.message === 'CredentialsSignin' 
          ? 'Credenciales inválidas' 
          : 'Error en el servidor'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center p-4 min-h-[65vh]">
      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-6 p-6 rounded-lg shadow-lg">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="612345678"
              pattern="\d{9}"
              maxLength="9"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex justify-center items-center gap-2">
              <Spinner1 />
              <span>Procesando...</span>
            </div>
          ) : (
            'Iniciar sesión'
          )}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
// 'use client'

// import { signIn } from 'next-auth/react';
// import { toast } from 'sonner';
// import Spinner1 from '@/components/spinner1';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// function LoginForm() {
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const formData = new FormData(e.currentTarget);
//       const phone = formData.get('phone');
//       const password = formData.get('password');

//       // Validación básica en cliente
//       if (!phone || !password) {
//         throw new Error("Todos los campos son requeridos");
//       }

//       const result = await signIn('credentials', {
//         phone,
//         password,
//         redirect: false,
//         callbackUrl: globalThis.callbackUrl || '/home'
//       });

//       if (result?.error) {
//         throw new Error(result.error);
//       }

//       if (result?.url) {
//         toast.success("¡Bienvenido!");
//         router.push(result.url);
//       }

//     } catch (error) {
//       // Mapeo de errores específicos
//       const errorMessage = error.message.includes("Contraseña") 
//         ? "Contraseña incorrecta" 
//         : error.message.includes("Usuario") 
//           ? "Número no registrado" 
//           : "Credenciales incorrectas";
          
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="w-full flex flex-col gap-10 p-6 rounded-lg">
//       <div className="flex flex-col gap-2">
//         <label htmlFor="phone">Número de teléfono</label>
//         <input
//           id="phone"
//           name="phone"
//           type="tel"
//           pattern="[0-9]{9}"
//           title="9 dígitos sin espacios ni guiones"
//           placeholder="612345678"
//           maxLength="9"
//           className="p-3 border rounded-lg"
//           required
//         />
//       </div>

//       <div className="flex flex-col gap-2">
//         <label htmlFor="password">Contraseña</label>
//         <input
//           id="password"
//           name="password"
//           type="password"
//           // minLength="6"
//           placeholder="••••••"
//           className="p-3 border rounded-lg"
//           required
//         />
//       </div>

//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
//       >
//         {loading ? <Spinner1 /> : "Iniciar sesión"}
//       </button>
//     </form>
//   );
// }

// export default LoginForm;