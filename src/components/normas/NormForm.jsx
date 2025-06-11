'use client'

import { FormField } from "./FormField"
import { SubmitButton } from "../SubmitButton"


export const NormForm = ({ action, defaultValues, isEditing = true }) => (
  <form
    action={action}
    className="space-y-6 bg-[#f9faf5] p-6 rounded-xl shadow-sm border border-[#b9b59c]"
  >
    <FormField
      name="titulo"
      label="Título de la norma"
      defaultValue={defaultValues?.titulo}
      required
    />
    <FormField
      name="contenido"
      label="Contenido"
      defaultValue={defaultValues?.contenido}
      textarea
      rows={5}
      required
    />
    <SubmitButton>
      {isEditing ? 'Guardar cambios' : 'Crear norma'}
    </SubmitButton>
  </form>
)