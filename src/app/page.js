import { redirect } from "next/navigation"; // IMPORTANTE: importar desde next/navigation

export default function RootPage() {
  redirect('/auth/login')
}