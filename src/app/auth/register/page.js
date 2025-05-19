import RegisterForm from '@/components/auth/register-form'
import Link from 'next/link'

function page() {
  return (
    <div className="mx-auto mt-5 max-w-sm p-8 border border-slate-300 rounded-2xl bg-white shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-1">Crear cuenta</h1>
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-slate-600">
        ¿Ya tienes cuenta? {" "}
        <Link href='/auth/login' className='text-blue-500 cursor-pointer'>
          Iniciar sesión.
        </Link>
      </p>

    </div>
  )
}

export default page