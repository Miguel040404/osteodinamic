import Footer from "@/components/footer";
import Header from "@/components/header";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-s flex flex-col w-full">
      <Header />
      <main>
        <h1 className="text-2xl font-bold">Elige una clase</h1>
        <div className="flex flex-col gap-4 mt-4">
          <Link href="/clases/pilates">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl">Pilates</button>
          </Link>
          <Link href="/clases/rehabilitacion_funcional">
            <button className="bg-green-600 text-white px-4 py-2 rounded-xl">Rehabilitación funcional</button>
          </Link>
          <Link href="/clases/entrenamiento_personal">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-xl">Entrenamiento personal</button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}