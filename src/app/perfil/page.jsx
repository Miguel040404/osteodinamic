import LogoutButton from "@/components/LogoutButton"
import Footer from "@/components/footer"
import PerfilLink from "@/components/perfil-link"
import EditarPerfilButton from "@/components/EditarPerfilButton"
import { BellRing, BookOpenCheck } from "lucide-react"
import { auth } from "@/auth"
import Users from "@/components/users/lista"
import { Suspense } from "react"
import prisma from "@/lib/prisma" // Asegúrate de importar prisma
import { redirect } from "next/navigation"

// Componente para el spinner de carga
const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#f9faf5] bg-opacity-80">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#a57551] mx-auto"></div>
      <p className="mt-4 text-lg text-[#4d4037] flex justify-center">
        Cargando perfil
        <span className="flex">
          <span className="animate-bounce">.</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
        </span>
      </p>
    </div>
  </div>
);

// Componente principal envuelto en Suspense
function PerfilContent() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PerfilData />
    </Suspense>
  );
}

// Componente que contiene la lógica de datos
async function PerfilData() {
  const session = await auth()

  if (!session) {
    return (
      redirect('/auth/login')
    )
  }

  const user = session.user;

  // Obtener usuario con sesiones pagadas
  const usuario = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      paidSessions: true
    }
  });

  console.log('Usuario con sesiones pagadas:', usuario);

  return (
    <div className="min-h-screen flex flex-col bg-[#f9faf5]">
      <main className="flex-1 container mx-auto px-4 py-10">
        {/* Perfil Card */}
        <section className="max-w-3xl mx-auto bg-white rounded-2xl p-6 sm:p-10 mb-10 border border-[#b9b59c]">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={user?.image || "/images/avatar-80.png"}
              alt="Imagen de usuario"
              className="w-36 h-36 rounded-full object-cover border-4 border-[#e8d7c3]"
            />

            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-[#4d4037] text-2xl font-bold">{user.name}</h2>
                <EditarPerfilButton user={usuario} />
              </div>

              <p className="text-[#4d4037]">
                Dirección: <span className="font-semibold text-[#a57551]">{usuario.address}</span>
              </p>

              <p className="text-[#4d4037]">
                Teléfono: <span className="font-semibold text-[#a57551]">{usuario.phone}</span>
              </p>

              <span className="inline-block mt-2 px-3 py-1 text-sm font-medium bg-[#e8d7c3] text-[#4d4037] rounded-full shadow-sm">
                Rol: {user.role}
              </span>
            </div>
          </div>
        </section>

        {/* Admin: Lista de usuarios */}
        {user.role === 'ADMIN' && (
          <section className="max-w-3xl mx-auto mb-10 border border-[#b9b59c]">
            <details className="bg-white rounded-lg p-4">
              <summary className="!text-[#4d4037] text-lg font-semibold cursor-pointer">Lista de usuarios</summary>
              <div className="mt-4">
                <Users />
              </div>
            </details>
          </section>
        )}

        {/* Enlaces de acción */}
        <section className="max-w-3xl mx-auto mb-10 grid gap-4 ">
          <PerfilLink
            label="Normas"
            href="/normas"
            icon={<BookOpenCheck className="h-5 w-5 text-[#7b6658]" />}
          />
          <PerfilLink
            label="Notificaciones"
            href="/notificaciones"
            icon={<BellRing className="h-5 w-5 text-[#daa074]" />}
          />
          <LogoutButton />
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default function Perfil() {
  return <PerfilContent />;
}