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
  globalThis.callbackUrl = decodeURIComponent(callbackUrl ?? '/dashboard')

  return (
    <>
      <div className="mx-auto mt-10 w-80 p-8 border border-slate-300 rounded-md bg-slate-50">
        {error && <h3>{errors.get(error)}</h3>}
        <h1 className='text-3xl font-bold py-4'>Iniciar sesión</h1>
        <LoginForm />
        <Link href='/auth/register' className='text-blue-500 cursor-pointer'>
          No tengo cuenta. Quiero crear una.
        </Link>
      </div>
    </>
  )
}

export default page