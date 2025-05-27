import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { getUserById } from "@/lib/data";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);

  // Verificar que haya sesión y que el usuario sea admin
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