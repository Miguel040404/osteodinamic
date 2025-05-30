'use client'
import { editUser } from '@/lib/actions'
import { useActionState, useEffect, useId, useState } from 'react'
import { XIcon, RefreshCwIcon, Eye, EyeOff, ChevronDown, User, MapPin, Phone, Lock, Crown } from 'lucide-react'
import { toast } from 'sonner'

export default function UserModificar({ user, sessionUser }) {
  const formId = useId();
  const [state, action, pending] = useActionState(editUser, {});
  const [showPassword, setShowPassword] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user.image || '/images/avatar-80.png');
  
  // Generar lista de avatares
  const avatares = [...Array(80)].map((_, index) => 
    `/images/avatar-${String(index).padStart(2, '0')}.png`
  );
  
  // Manejar cambio de avatar
  const handleAvatarChange = (avatar) => {
    setSelectedAvatar(avatar);
    setAvatarOpen(false);
  };

  useEffect(() => {
    if (state?.error) {
      if (state.error.includes('teléfono')) {
        toast.error(state.error, {
          action: {
            onClick: () => document.getElementById('phone').focus()
          }
        });
      } else {
        toast.error(state.error);
      }
    }
    if (state?.success) {
      toast.success(state.success);
      document.getElementById(formId)?.closest('dialog')?.close();
    }
  }, [state]);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Editar usuario</h2>
          <button
            type="button"
            onClick={() => document.getElementById(formId)?.closest('dialog')?.close()}
            className="text-white hover:text-indigo-200 transition-colors"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
      </div> */}

      <form id={formId} action={action} className="p-6">
        <input type="hidden" name="id" defaultValue={user.id} />
        
        {/* Selector de avatar */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar avatar
          </label>
          
          <div className="relative">
            <button
              type="button"
              onClick={() => setAvatarOpen(!avatarOpen)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img 
                  src={selectedAvatar} 
                  alt="Avatar seleccionado" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                {/* <span className="text-gray-700 font-medium">
                  {selectedAvatar.split('-').pop().replace('.png', '')}
                </span> */}
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${avatarOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <input type="hidden" name="image" value={selectedAvatar} />
            
            {avatarOpen && (
              <div className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
                <div className="grid grid-cols-5 gap-2 p-3">
                  {avatares.map((avatar, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleAvatarChange(avatar)}
                      className={`p-1 rounded-full hover:bg-indigo-50 transition-colors ${
                        selectedAvatar === avatar ? 'ring-2 ring-indigo-500' : ''
                      }`}
                    >
                      <img 
                        src={avatar} 
                        alt={`Avatar ${index}`} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Campos del formulario */}
        <div className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              defaultValue={user.name}
              placeholder="Nombre completo"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="address"
              defaultValue={user.address}
              placeholder="Dirección"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              defaultValue={user.phone}
              placeholder="Teléfono"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              pattern="[0-9]{9}"
              maxLength="9"
              title="Número de 9 dígitos"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Nueva contraseña"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {sessionUser?.role === 'ADMIN' && sessionUser.id !== user.id && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Crown className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="role"
                defaultValue={user.role}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
              >
                <option value="USER">Usuario</option>
                <option value="ADMIN">Administrador</option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={pending}
        //   className="w-full mt-8 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
          className="w-full mt-8 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
        
        >
          {pending ? (
            <div className="flex items-center justify-center">
              <RefreshCwIcon className="animate-spin mr-2" />
              <span>Guardando...</span>
            </div>
          ) : (
            'Guardar cambios'
          )}
        </button>
      </form>
    </div>
  )
}