import LoginForm from '@/components/auth/login-form'
import Link from 'next/link';

// https://next-auth.js.org/configuration/pages#sign-in-page
const errors = new Map();
errors.set('OAuthSignin', "Error al construir una URL de autorización.");
errors.set('OAuthCallback', "Error al manejar la respuesta de un proveedor de OAuth.");
errors.set('OAuthCreateAccount', "No se pudo crear un usuario proveedor de OAuth en la base de datos.");
errors.set('EmailCreateAccount', "No se pudo crear un usuario de proveedor de correo electrónico en la base de datos.");
errors.set('Callback', "Error en la ruta del controlador de devolución de llamada de OAuth.");
errors.set('OAuthAccountNotLinked', "Este email ya está registrado con otro proveedor.");
errors.set('EmailSignin', "Comprueba tu dirección de correo electrónico.");
errors.set('CredentialsSignin', "Fallo al iniciar sesion. Verifique que los datos que proporcionó sean correctos.");
errors.set('SessionRequired', "Error al iniciar sesión. Verifique que los detalles que proporcionó sean correctos.");
errors.set('Default', "No se puede iniciar sesión.");


async function page({ searchParams }) {
  const { error, callbackUrl } = await searchParams
  // Usamos globalThis para almacenar variable global
  // La usaremos en los actions de login
  globalThis.callbackUrl = decodeURIComponent(callbackUrl ?? '/home')

  return (
    <>
     <div>
  {error && (
    <div className="mb-4 text-red-600 font-medium">
      {errors.get(error)}
    </div>
  )}
  
 {/* <h1 className="!text-gray-700 text-3xl md:text-2xl font-bold text-center -mb-6 md:-mb-3">Iniciar sesión</h1> */}

  <LoginForm />

</div>

    </>
  )
}

export default page


// import LoginForm from '@/components/auth/login-form';
// import Link from 'next/link';

// const errorMessages = {
//   'Formato de teléfono inválido': 'El teléfono debe tener 9 dígitos',
//   'Usuario no registrado': 'Número no registrado',
//   'Contraseña incorrecta': 'Contraseña incorrecta',
//   'Default': 'Error al iniciar sesión'
// };

// export default function Page({ searchParams }) {
//   const error = searchParams.error;
//   const callbackUrl = searchParams.callbackUrl || '/home';

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h1>
//           <p className="text-gray-600">Inicia sesión en tu cuenta</p>
//         </div>

//         {error && (
//           <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-center">
//             {errorMessages[error] || errorMessages.Default}
//           </div>
//         )}

//         <LoginForm />

//         {/* <div className="mt-6 text-center text-sm">
//           <span className="text-gray-600">¿Primera vez aquí? </span>
//           <Link
//             href={`/auth/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
//             className="text-blue-600 hover:underline font-medium"
//           >
//             Crear cuenta
//           </Link>
//         </div> */}
//       </div>
//     </div>
//   );
// }