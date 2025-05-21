"use client";

import { useActionState } from "react";
import { crearHorario } from "@/lib/actions";
import { useEffect } from "react";
import { toast } from "sonner";

export const CrearHorarioForm = ({ tipo }) => {
    const [state, formAction] = useActionState(crearHorario, null);

    useEffect(() => {
        if (state?.message) {
            if (state.success) {
                toast.success(state.message);
            } else {
                toast.error(state.message);
            }
        }
    }, [state]);

    return (
        <form action={formAction} className="space-y-4">
            <h3 className="text-lg font-semibold">Añadir nuevo horario</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <select name="dia" className="border p-2 rounded" required>
                    <option value="">Selecciona un día</option>
                    <option value="Lunes">Lunes</option>
                    <option value="Martes">Martes</option>
                    <option value="Miércoles">Miércoles</option>
                    <option value="Jueves">Jueves</option>
                    <option value="Viernes">Viernes</option>
                    <option value="Sábado">Sábado</option>
                    <option value="Domingo">Domingo</option>
                </select>

                <select name="hora" className="border p-2 rounded" required>
                    <option value="">Selecciona una hora</option>
                    {[
                        "08:00", "09:00", "10:00", "11:00",
                        "12:00", "13:00", "14:00", "15:00",
                        "16:00", "17:00", "18:00", "19:00", "20:00"
                    ].map((hora) => (
                        <option key={hora} value={hora}>{hora}</option>
                    ))}
                </select>

                <input type="hidden" name="tipo" value={tipo} />
            </div>

            {state?.error && (
                <p className="text-red-500 text-sm">{state.error}</p>
            )}

            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                Crear Horario
            </button>
        </form>
    );
};