import { crearNotificacion } from './actions'

export default function CrearNotificacionPage() {
  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Crear notificación</h1>
      <form action={crearNotificacion} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Título"
          required
          className="w-full border p-2 rounded"
        />
        <textarea
          name="message"
          placeholder="Mensaje"
          required
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Enviar notificación
        </button>
      </form>
    </div>
  )
}
