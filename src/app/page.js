// import { redirect } from "next/navigation"; // IMPORTANTE: importar desde next/navigation


// export default function RootPage() {
//   redirect('/auth/login')
// }


'use client'

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Espera mientras se carga la sesión

    if (status === "authenticated") {
      router.push("/home");
    } else {
      router.push("/auth/login");
    }
  }, [status, router]);

  return <div>Redirigiendo...</div>;
}

