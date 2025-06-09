'use client'

import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import Spinner1 from '@/components/spinner1';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, Phone, Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const callbackUrl = searchParams.get('callbackUrl') || '/home';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const credentials = Object.fromEntries(formData);
      
      // Eliminar espacios del teléfono para validación
      const rawPhone = credentials.phone.replace(/\s/g, '');
      
      // Validación del teléfono (debe tener 9 dígitos)
      if (!/^\d{9}$/.test(rawPhone)) {
        throw new Error('InvalidPhoneFormat');
      }

      // Construir URL absoluta para producción
      const absoluteCallbackUrl = new URL(
        callbackUrl,
        process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
      ).toString();

      // Enviar el teléfono sin espacios
      const result = await signIn('credentials', {
        redirect: false,
        ...credentials,
        phone: rawPhone,  // Usamos la versión sin espacios
        callbackUrl: absoluteCallbackUrl,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Redirección segura
      if (result?.url) {
        window.location.href = result.url;
      } else {
        router.refresh();
        router.push(absoluteCallbackUrl);
      }

    } catch (error) {
      const errorMessages = {
        'CredentialsSignin': 'Credenciales incorrectas',
        'InvalidPhoneFormat': 'El teléfono debe tener 9 dígitos',
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
            <Lock className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Inicia Sesión</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Campo de teléfono */}
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-indigo-600" />
                  <span>Número de teléfono</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">+34</span>
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="612 345 678"
                    className="pl-12 !text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    disabled={loading}
                    onInput={(e) => {
                      // Eliminar todo lo que no sea dígito
                      let value = e.target.value.replace(/\D/g, '');
                      
                      // Limitar a 9 caracteres
                      if (value.length > 9) {
                        value = value.substring(0, 9);
                      }
                      
                      // Formatear con espacios cada 3 dígitos
                      if (value.length > 6) {
                        value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
                      } else if (value.length > 3) {
                        value = value.replace(/(\d{3})(\d{1,3})/, '$1 $2');
                      }
                      e.target.value = value;
                    }}
                  />
                </div>
              </div>

              {/* Resto del formulario sin cambios */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-indigo-600" />
                  <span>Contraseña</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="!text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 transition-all"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md"
              >
                {loading ? (
                  <div className="flex justify-center items-center gap-3">
                    <Spinner1 />
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>Iniciar sesión</span>
                  </span>
                )}
              </button>
            </div>
           </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;