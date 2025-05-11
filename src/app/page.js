
// import { redirect } from "next/navigation"; // IMPORTANTE: importar desde next/navigation


// export default function RootPage() {
//   redirect('/auth/login')
// }

'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay un token en localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // Si hay un token, redirigir a la página principal
      router.push('/home');
    } else {
      // Si no hay un token, redirigir a la página de inicio de sesión
      router.push('/auth/login');
    }
  }, [router]);

  // Puedes devolver un componente de carga o nada mientras se realiza la redirección
  return <div>Redirigiendo...</div>;
}
