import { NextResponse } from "next/server";
import { getUserById } from "@/lib/data";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function GET(req, { params }) {
  const session = await auth();
  
    if (!session) {
      return (
       redirect('/auth/login')
      )
    }

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const userId = params.id;
  const user = await getUserById(userId);

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    active: user.active,
    role: user.role,
  });
}