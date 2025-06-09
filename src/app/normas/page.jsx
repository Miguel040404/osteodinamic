import Link from 'next/link'
import { PlusIcon, PencilIcon, TrashIcon, BookText, ClockIcon } from 'lucide-react'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import Footer from '@/components/footer'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { eliminarNorma } from '@/lib/actions'

// Spinner de carga (mismo que en notificaciones)
const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#f9faf5] bg-opacity-80">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#a57551] mx-auto"></div>
      <p className="mt-4 text-lg text-[#4d4037] flex justify-center">
        Cargando normas
        <span className="flex">
          <span className="animate-bounce">.</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
        </span>
      </p>
    </div>
  </div>
);

async function NormasContent() {
  const session = await auth()
  if (!session) redirect('/auth/login')

  const normas = await prisma.norma.findMany({
    orderBy: { creadaEn: 'desc' },
  })

  return (
    <div className="min-h-screen bg-[#f9faf5]">
      <div className="max-w-4xl mx-auto py-10 px-4">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#4d4037] flex items-center gap-3">
              <BookText className="w-8 h-8 text-[#a57551]" />
              Normas
            </h1>
            <p className="text-[#7b6b5d] mt-1">
              {normas.length} norma{normas.length !== 1 ? 's' : ''}
            </p>
          </div>

          {session.user.role === 'ADMIN' && (
            <Link href="/normasAdmin">
              <button className="flex items-center gap-2 bg-[#a57551] hover:bg-[#8f6043] text-white px-4 py-2.5 rounded-lg transition shadow-sm hover:shadow-md">
                <PlusIcon className="w-5 h-5" />
                <span>Nueva Norma</span>
              </button>
            </Link>
          )}
        </div>

        {/* Lista de normas */}
        <div className="space-y-6">
          {normas.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm p-8 border border-[#b9b59c]">
              <div className="bg-[#e8d7c3] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookText className="w-8 h-8 text-[#a57551]" />
              </div>
              <h3 className="text-xl font-medium text-[#4d4037]">No hay normas</h3>
              <p className="text-[#7b6b5d] mt-2">No se han publicado normas aún</p>
            </div>
          ) : (
            normas.map((n) => (
              <div
                key={n.id}
                className="bg-[#f5e19106] border border-[#b9b59c] rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-[#e8d7c3] p-2 rounded-lg">
                          <BookText className="w-5 h-5 text-[#a57551]" />
                        </div>
                        <h2 className="text-xl font-semibold text-[#4d4037]">{n.titulo}</h2>
                      </div>

                      <p className="text-[#4d4037] mt-3">{n.contenido}</p>

                      <div className="flex items-center gap-4 mt-4 text-sm text-[#7b6b5d]">
                        <div className="flex items-center gap-2">
                          <ClockIcon className="w-4 h-4" />
                          <span>{new Date(n.creadaEn).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {session.user.role === 'ADMIN' && (
                      <div className="flex flex-col gap-3 min-w-[120px]">
                        <Link href={`/normasAdmin/${n.id}/editar`}>
                          <button className="flex items-center gap-2 bg-white border border-[#b9b59c] text-[#4d4037] hover:bg-[#f3ece3] w-full px-3 py-2 rounded-lg transition-colors">
                            <PencilIcon className="w-4 h-4" />
                            <span>Editar</span>
                          </button>
                        </Link>

                        <form action={eliminarNorma} className="w-full">
                          <input type="hidden" name="id" value={n.id} />
                          <button
                            type="submit"
                            className="flex items-center gap-2 bg-white border border-[#b9b59c] text-red-600 hover:bg-red-50 w-full px-3 py-2 rounded-lg transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                            <span>Eliminar</span>
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-12">
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default function NormasPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <NormasContent />
    </Suspense>
  )
}