import { logout } from "@/lib/actions"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { Lock } from "lucide-react"


async function page() {
  const sesion = await auth()

  if (sesion) {
    return (
      <>
        <h1>Cerrar sesión</h1>
        <form>
          <button formAction={logout} className="logout">
            <Lock /> Cerrar sesión
          </button>
        </form>
      </>
    )
  }
  else {
    redirect('/auth/login')
  }
}

export default page