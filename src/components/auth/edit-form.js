'use client'

import { editUser } from '@/lib/actions'
import { useActionState, useEffect, useId, useState } from 'react'
import { RefreshCwIcon, Eye, EyeOff, ChevronDown, User, MapPin, Phone, Lock, Crown } from 'lucide-react'
import { toast } from 'sonner'


export default function UserModificar({ user, sessionUser }) {
  const formId = useId();
  const [state, action, pending] = useActionState(editUser, {});
  const [showPassword, setShowPassword] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.image || '/images/avatar-80.png');

  const [pilatesChecked, setPilatesChecked] = useState(false);
  const [rehabilitacionChecked, setRehabilitacionChecked] = useState(false);
  const [entrenamientoChecked, setEntrenamientoChecked] = useState(false);

  const avatares = [...Array(80)].map((_, index) =>
    `/images/avatar-${String(index).padStart(2, '0')}.png`
  );

  useEffect(() => {
    if (user?.paidSessions) {
      setPilatesChecked(user.paidSessions.some(ps => ps.sessionType === 'Pilates'));
      setRehabilitacionChecked(user.paidSessions.some(ps => ps.sessionType === 'Rehabilitacion_funcional'));
      setEntrenamientoChecked(user.paidSessions.some(ps => ps.sessionType === 'Entrenamiento_personal'));
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

        {/* Avatar */}
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
                      className={`cursor-pointer p-1 rounded-full hover:bg-[#f5ebe0] transition-colors ${
                        selectedAvatar === avatar ? 'ring-2 ring-[#8B5E3C]' : ''
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

        {/* Campos */}
        <div className="space-y-5">
          {[
            { icon: <User />, name: 'name', value: user?.name, placeholder: 'Nombre completo' },
            { icon: <MapPin />, name: 'address', value: user?.address, placeholder: 'Dirección' },
            { icon: <Phone />, name: 'phone', value: user?.phone, placeholder: 'Teléfono', id: 'phone', type: 'tel', pattern: '[0-9]{9}', maxLength: 9, title: 'Número de 9 dígitos' }
          ].map((field, i) => (
            <div className="relative" key={i}>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                {field.icon}
              </div>
              <input
                type={field.type || 'text'}
                id={field.id}
                name={field.name}
                defaultValue={field.value}
                placeholder={field.placeholder}
                pattern={field.pattern}
                maxLength={field.maxLength}
                title={field.title}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5E3C] focus:border-[#8B5E3C]"
              />
            </div>
          ))}

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Nueva contraseña"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5E3C] focus:border-[#8B5E3C]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Sesiones */}
          {sessionUser?.role === 'ADMIN' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">Sesiones pagadas</label>
              <div className="space-y-3">
                {/* Pilates */}
                <div
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    pilatesChecked ? 'border-[#A0522D] bg-[#f3e1d5] shadow-sm' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPilatesChecked(!pilatesChecked)}
                >
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="paidSessions"
                      value="Pilates"
                      checked={pilatesChecked}
                      onChange={() => setPilatesChecked(!pilatesChecked)}
                      className="h-4 w-4 text-[#A0522D] focus:ring-[#A0522D]"
                    />
                    <div className="ml-3 text-sm">
                      <span className="font-medium text-gray-900">Pilates terapéutico</span>
                      <p className="mt-1 text-gray-500">Sesiones de fortalecimiento y rehabilitación</p>
                    </div>
                  </div>
                </div>

                {/* Rehabilitación */}
                <div
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    rehabilitacionChecked ? 'border-[#8B7355] bg-[#ede5dc] shadow-sm' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setRehabilitacionChecked(!rehabilitacionChecked)}
                >
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="paidSessions"
                      value="Rehabilitacion_funcional"
                      checked={rehabilitacionChecked}
                      onChange={() => setRehabilitacionChecked(!rehabilitacionChecked)}
                      className="h-4 w-4 text-[#8B7355] focus:ring-[#8B7355]"
                    />
                    <div className="ml-3 text-sm">
                      <span className="font-medium text-gray-900">Rehabilitación Funcional</span>
                      <p className="mt-1 text-gray-500">Recuperación de movilidad y funcionalidad</p>
                    </div>
                  </div>
                </div>

                {/* Entrenamiento */}
                <div
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    entrenamientoChecked ? 'border-[#A67B5B] bg-[#f4e9df] shadow-sm' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setEntrenamientoChecked(!entrenamientoChecked)}
                >
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="paidSessions"
                      value="Entrenamiento_personal"
                      checked={entrenamientoChecked}
                      onChange={() => setEntrenamientoChecked(!entrenamientoChecked)}
                      className="h-4 w-4 text-[#A67B5B] focus:ring-[#A67B5B]"
                    />
                    <div className="ml-3 text-sm">
                      <span className="font-medium text-gray-900">Salud activa personal</span>
                      <p className="mt-1 text-gray-500">Entrenamiento personalizado para tu bienestar</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rol */}
          {sessionUser?.role === 'ADMIN' && sessionUser?.id !== user?.id && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Crown className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="role"
                defaultValue={user?.role}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5E3C] focus:border-[#8B5E3C] appearance-none bg-white"
              >
                <option value="USER">Usuario</option>
                <option value="ADMIN">Administrador</option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer w-full mt-8 py-3 px-4 bg-[#8B5E3C] hover:bg-[#7A4E30] text-white font-medium rounded-lg shadow-md transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
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