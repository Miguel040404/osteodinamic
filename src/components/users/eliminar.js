'use client'

import { deleteUser } from "@/lib/actions";
import { RefreshCwIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useId } from "react";
import { toast } from "sonner";


function UserEliminar({ user }) {
  const formId = useId();
  const [state, action, pending] = useActionState(deleteUser, {});
  const { refresh } = useRouter();

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      document.getElementById(formId).closest('dialog')?.close();
      refresh();
    }
    if (state?.error) toast.error(state.error);
  }, [formId, state]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 rounded-2xl bg-[#fdfaf6] border border-[#e4d6c3] shadow-lg">
      <div className="grid md:grid-cols-[120px_auto] gap-6 items-center">
        <div className="flex justify-center md:justify-start">
          <img
            src={user.image || '/images/avatar-80.png'}
            alt="Imagen de usuario"
            className="w-28 h-28 rounded-full border-4 border-[#d2b48c] object-cover shadow"
          />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-2xl font-semibold text-[#5C4033]">{user.name}</h1>
          <p className="text-sm text-[#6B4F3B]">
            <span className="font-medium text-[#5C4033]">Teléfono:</span> {user.phone || "No disponible"}
          </p>
          <p className="text-sm text-[#6B4F3B]">
            <span className="font-medium text-[#5C4033]">Dirección:</span> {user.address || "No disponible"}
          </p>
        </div>
      </div>

      <form id={formId} action={action} className="w-full flex md:justify-end justify-center mt-4">
        <input type="hidden" name="id" defaultValue={user.id} />
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 font-semibold bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-all"
        >
          {pending ? (
            <>
              <RefreshCwIcon className="w-4 h-4 animate-spin" />
              Eliminando...
            </>
          ) : (
            <>
              <TrashIcon className="w-4 h-4" />
              Eliminar
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default UserEliminar;