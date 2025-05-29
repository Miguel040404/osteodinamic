'use client'

import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import Spinner1 from '@/components/spinner1';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const callbackUrl = searchParams.get('callbackUrl') || '/home';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const credentials = Object.fromEntries(formData);
      
      // Validación mejorada del teléfono
      if (!/^\d{9}$/.test(credentials.phone)) {
        throw new Error('InvalidPhoneFormat');
      }

      // Construir URL absoluta para producción
      const absoluteCallbackUrl = new URL(
        callbackUrl,
        process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
      ).toString();

      const result = await signIn('credentials', {
        redirect: false,
        ...credentials,
        callbackUrl: absoluteCallbackUrl,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Redirección segura
      if (result?.url) {
        window.location.href = result.url; // Usar window.location para recargar sesión
      } else {
        router.refresh();
        router.push(absoluteCallbackUrl);
      }

    } catch (error) {
      const errorMessages = {
        'CredentialsSignin': 'Credenciales incorrectas',
        'InvalidPhoneFormat': 'Teléfono debe tener 9 dígitos',
        'NetworkError': 'Error de conexión con el servidor',
        'CallbackRouteError': 'Error en configuración del servidor'
      };
      
      toast.error(errorMessages[error.message] || 'Error desconocido');
      console.error('Error de autenticación:', error);

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
              inputMode="numeric"
              pattern="[0-9]{9}"
              placeholder="612345678"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0,9);
              }}
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