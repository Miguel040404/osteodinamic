'use client'

import { SubmitButton2 } from "../SubmitButton2"


export const NotificationForm = ({ 
  action, 
  defaultValues, 
  isEditing = false,
  onSubmit // Opcional para formularios client-side
}) => {
  return (
    <form 
      action={!onSubmit ? action : undefined}
      onSubmit={onSubmit}
      className="space-y-6 bg-[#f9faf5] p-6 rounded-xl shadow-sm border border-[#b9b59c]"
    >
      <div className="space-y-2">
        <label className="text-[#4d4037] font-medium">Título</label>
        <input
          type="text"
          name="title"
          defaultValue={defaultValues?.title}
          placeholder="Título descriptivo"
          required
          className="bg-white w-full border !text-[#4d4037] border-[#b9b59c] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#a57551] focus:border-[#a57551] outline-none transition"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[#4d4037] font-medium">Mensaje</label>
        <textarea
          name="message"
          defaultValue={defaultValues?.message}
          placeholder="Contenido completo"
          required
          rows={5}
          className="bg-white w-full border !text-[#4d4037] border-[#b9b59c] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#a57551] focus:border-[#a57551] outline-none transition resize-none"
        />
      </div>

      <SubmitButton2>
        {isEditing ? 'Guardar cambios' : 'Publicar notificación'}
      </SubmitButton2>
    </form>
  )
}