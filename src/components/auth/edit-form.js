'use client'
import { editUser } from '@/lib/actions'
import { useActionState, useEffect, useId, useState } from 'react'
import { RefreshCwIcon, Eye, EyeOff, ChevronDown, User, MapPin, Phone, Lock, Crown } from 'lucide-react'
import { toast } from 'sonner'

export default function UserModificar({ user , sessionUser  }) {
  const formId = useId();
  const [state, action, pending] = useActionState(editUser, {});
  const [showPassword, setShowPassword] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.image || '/images/avatar-80.png');
  
  // Estado para cada tipo de sesión
  const [pilatesChecked, setPilatesChecked] = useState(false);
  const [rehabilitacionChecked, setRehabilitacionChecked] = useState(false);
  const [entrenamientoChecked, setEntrenamientoChecked] = useState(false);
  
  const avatares = [...Array(80)].map((_, index) => 
    `/images/avatar-${String(index).padStart(2, '0')}.png`
  );
  
  // Inicializar sesiones cuando el usuario cambia
  useEffect(() => {
    if (user?.paidSessions) {
      setPilatesChecked(user?.paidSessions.some(ps => ps.sessionType === 'Pilates'));
      setRehabilitacionChecked(user?.paidSessions.some(ps => ps.sessionType === 'Rehabilitacion_funcional'));
      setEntrenamientoChecked(user?.paidSessions.some(ps => ps.sessionType === 'Entrenamiento_personal'));
    }
  }, [user]);

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
  }, [state, formId]);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <form id={formId} action={action} className="p-6">
        <input type="hidden" name="id" defaultValue={user?.id} />
        
        {/* Selector de avatar */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar avatar
          </label>
          
          <div className="relative">
            <button
              type="button"
              onClick={() => setAvatarOpen(!avatarOpen)}
              className="cursor-pointer w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img 
                  src={selectedAvatar} 
                  alt="Avatar seleccionado" 
                  className="w-12 h-12 rounded-full object-cover"
                />
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
                      className={`cursor-pointer p-1 rounded-full hover:bg-indigo-50 transition-colors ${
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
              defaultValue={user?.name}
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
              defaultValue={user?.address}
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
              defaultValue={user?.phone}
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
              className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {/* Sección para sesiones pagadas - SOLO ADMINISTRADORES */}
          {sessionUser?.role === 'ADMIN' && (
        <div className="mt-4">
  <label className="block text-sm font-medium text-gray-700 mb-3">Sesiones pagadas</label>
  <div className="space-y-3">
    {/* Tarjeta Pilates - ROJO */}
    <div 
      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        pilatesChecked 
          ? "border-red-500 bg-red-50 shadow-sm" 
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={() => setPilatesChecked(!pilatesChecked)}
    >
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input 
            type="checkbox"
            name="paidSessions"
            value="Pilates"
            checked={pilatesChecked}
            onChange={() => setPilatesChecked(!pilatesChecked)}
            className="h-4 w-4 text-red-600 focus:ring-red-500"
          />
        </div>
        <div className="ml-3 text-sm">
          <span className="font-medium text-gray-900">Pilates terapéutico</span>
          <p className="mt-1 text-gray-500">Sesiones de fortalecimiento y rehabilitación</p>
        </div>
      </div>
      {pilatesChecked && (
        <div className="absolute top-2 right-2 text-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>

    {/* Tarjeta Rehabilitación - VERDE */}
    <div 
      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        rehabilitacionChecked 
          ? "border-green-500 bg-green-50 shadow-sm" 
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={() => setRehabilitacionChecked(!rehabilitacionChecked)}
    >
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input 
            type="checkbox"
            name="paidSessions"
            value="Rehabilitacion_funcional"
            checked={rehabilitacionChecked}
            onChange={() => setRehabilitacionChecked(!rehabilitacionChecked)}
            className="h-4 w-4 text-green-600 focus:ring-green-500"
          />
        </div>
        <div className="ml-3 text-sm">
          <span className="font-medium text-gray-900">Rehabilitación Funcional</span>
          <p className="mt-1 text-gray-500">Recuperación de movilidad y funcionalidad</p>
        </div>
      </div>
      {rehabilitacionChecked && (
        <div className="absolute top-2 right-2 text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>

    {/* Tarjeta Entrenamiento - AZUL */}
    <div 
      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        entrenamientoChecked 
          ? "border-blue-500 bg-blue-50 shadow-sm" 
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={() => setEntrenamientoChecked(!entrenamientoChecked)}
    >
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input 
            type="checkbox"
            name="paidSessions"
            value="Entrenamiento_personal"
            checked={entrenamientoChecked}
            onChange={() => setEntrenamientoChecked(!entrenamientoChecked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
          />
        </div>
        <div className="ml-3 text-sm">
          <span className="font-medium text-gray-900">Salud activa personal</span>
          <p className="mt-1 text-gray-500">Entrenamiento personalizado para tu bienestar</p>
        </div>
      </div>
      {entrenamientoChecked && (
        <div className="absolute top-2 right-2 text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  </div>
</div>

          )}

          {sessionUser?.role === 'ADMIN' && sessionUser?.id !== user?.id && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Crown className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="role"
                defaultValue={user?.role}
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
          className="cursor-pointer w-full mt-8 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
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