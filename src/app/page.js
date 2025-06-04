'use client'

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-80">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-lg text-gray-600 flex justify-center">
        Redirigiendo
        <span className="flex">
          <span className="animate-bounce">.</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
        </span>
      </p>
    </div>
  </div>
);


export default function RootPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated") {
      router.push("/home");
    } else {
      router.push("/auth/login");
    }
  }, [status, router]);

  // Mostrar spinner durante la carga de la sesión
  if (status === "loading") {
    return <LoadingSpinner />;
  }

  // Esto solo se mostrará brevemente durante la redirección
  // return (
  //   <div className="fixed inset-0 flex items-center justify-center">
  //     <p className="text-xl font-semibold text-gray-700">
  //       Redirigiendo
  //     </p>
  //   </div>
  // );
}

// 'use client'

// import { useSession } from "next-auth/react";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function RootPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (status === "loading") return; // Espera mientras se carga la sesión

//     if (status === "authenticated") {
//       router.push("/home");
//     } else {
//       router.push("/auth/login");
//     }
//   }, [status, router]);

//   return (
//     <div style={{
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       height: '100vh',
//       fontSize: '24px',
//       fontWeight: 'bold',
//       color: '#333'
//     }}>
//       Redirigiendo...
//     </div>
//   );
// }