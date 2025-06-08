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

  console.log(user, 'user');

  const [selectedAvatar, setSelectedAvatar] = useState(user?.image || '/images/avatar-80.png');
  
  // Estado para las sesiones pagadas
  const [paidSessions, setPaidSessions] = useState(user.paidSessions || []);

  console.log(user, 'paidSessions');
  
  const avatares = [...Array(80)].map((_, index) => 
    `/images/avatar-${String(index).padStart(2, '0')}.png`
  );
  
  // Inicializar sesiones cuando el usuario cambia
  useEffect(() => {
    // Extraemos los sessionType de las paidSessions del usuario
    const sessions = user.paidSessions?.map(ps => ps.sessionType) || [];
    setPaidSessions(sessions);
  }, [user]);

  const handleAvatarChange = (avatar) => {
    setSelectedAvatar(avatar);
    setAvatarOpen(false);
  };

  // Función para manejar cambios en las sesiones
  const handleSessionChange = (sessionType) => {
    setPaidSessions(prev => 
      prev.includes(sessionType)
        ? prev.filter(s => s !== sessionType)
        : [...prev, sessionType]
    );
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
              className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {/* Sección para sesiones pagadas - SOLO ADMINISTRADORES - CON BOTONES TOGGLE */}
          {sessionUser?.role === 'ADMIN' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">Sesiones pagadas</label>
              <div className="flex flex-wrap gap-2">
                {['Pilates', 'Rehabilitacion_funcional', 'Entrenamiento_personal'].map((session) => {
                  const isActive = paidSessions.includes(session);
                  let displayName = session;
                  
                  if (session === 'Rehabilitacion_funcional') displayName = 'Rehabilitación';
                  if (session === 'Entrenamiento_personal') displayName = 'Entrenamiento';
                  
                  return (
                    <button
                      key={session}
                      type="button"
                      onClick={() => handleSessionChange(session)}
                      className={`cursor-pointer px-4 py-2 rounded-full transition-all ${
                        isActive 
                          ? 'bg-indigo-600 text-white shadow-md' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isActive ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <span>{displayName}</span>
                      </div>
                    </button>
                  );
                })}
                
                {/* Inputs ocultos para enviar las sesiones seleccionadas */}
                {paidSessions.map(session => (
                  <input 
                    key={session} 
                    type="hidden" 
                    name="paidSessions" 
                    value={session} 
                  />
                ))}
              </div>
            </div>
          )}

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
// 'use client'
// import { editUser } from '@/lib/actions'
// import { useActionState, useEffect, useId, useState } from 'react'
// import { XIcon, RefreshCwIcon, Eye, EyeOff, ChevronDown, User, MapPin, Phone, Lock, Crown } from 'lucide-react'
// import { toast } from 'sonner'

// export default function UserModificar({ user, sessionUser }) {
//   const formId = useId();
//   const [state, action, pending] = useActionState(editUser, {});
//   const [showPassword, setShowPassword] = useState(false);
//   const [avatarOpen, setAvatarOpen] = useState(false);
//   const [selectedAvatar, setSelectedAvatar] = useState(user.image || '/images/avatar-80.png');
  
//   // Generar lista de avatares
//   const avatares = [...Array(80)].map((_, index) => 
//     `/images/avatar-${String(index).padStart(2, '0')}.png`
//   );
  
//   // Manejar cambio de avatar
//   const handleAvatarChange = (avatar) => {
//     setSelectedAvatar(avatar);
//     setAvatarOpen(false);
//   };

//   useEffect(() => {
//     if (state?.error) {
//       if (state.error.includes('teléfono')) {
//         toast.error(state.error, {
//           action: {
//             onClick: () => document.getElementById('phone').focus()
//           }
//         });
//       } else {
//         toast.error(state.error);
//       }
//     }
//     if (state?.success) {
//       toast.success(state.success);
//       document.getElementById(formId)?.closest('dialog')?.close();
//     }
//   }, [state]);

//   return (
//     <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
//       <form id={formId} action={action} className="p-6">
//         <input type="hidden" name="id" defaultValue={user.id} />
        
//         {/* Selector de avatar */}
//         <div className="mb-8">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Seleccionar avatar
//           </label>
          
//           <div className="relative">
//             <button
//               type="button"
//               onClick={() => setAvatarOpen(!avatarOpen)}
//               className="w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
//             >
//               <div className="flex items-center gap-3">
//                 <img 
//                   src={selectedAvatar} 
//                   alt="Avatar seleccionado" 
//                   className="w-12 h-12 rounded-full object-cover"
//                 />
//               </div>
//               <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${avatarOpen ? 'rotate-180' : ''}`} />
//             </button>
            
//             <input type="hidden" name="image" value={selectedAvatar} />
            
//             {avatarOpen && (
//               <div className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
//                 <div className="grid grid-cols-5 gap-2 p-3">
//                   {avatares.map((avatar, index) => (
//                     <button
//                       key={index}
//                       type="button"
//                       onClick={() => handleAvatarChange(avatar)}
//                       className={`p-1 rounded-full hover:bg-indigo-50 transition-colors ${
//                         selectedAvatar === avatar ? 'ring-2 ring-indigo-500' : ''
//                       }`}
//                     >
//                       <img 
//                         src={avatar} 
//                         alt={`Avatar ${index}`} 
//                         className="w-10 h-10 rounded-full object-cover"
//                       />
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
        
//         {/* Campos del formulario */}
//         <div className="space-y-5">
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <User className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               name="name"
//               defaultValue={user.name}
//               placeholder="Nombre completo"
//               className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>
          
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <MapPin className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               name="address"
//               defaultValue={user.address}
//               placeholder="Dirección"
//               className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>
          
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <Phone className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="tel"
//               id="phone"
//               name="phone"
//               defaultValue={user.phone}
//               placeholder="Teléfono"
//               className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               pattern="[0-9]{9}"
//               maxLength="9"
//               title="Número de 9 dígitos"
//             />
//           </div>
          
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <Lock className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               placeholder="Nueva contraseña"
//               className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
//               aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
//             >
//               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//           </div>

//           {sessionUser?.role === 'ADMIN' && sessionUser.id !== user.id && (
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <Crown className="h-5 w-5 text-gray-400" />
//               </div>
//               <select
//                 name="role"
//                 defaultValue={user.role}
//                 className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
//               >
//                 <option value="USER">Usuario</option>
//                 <option value="ADMIN">Administrador</option>
//               </select>
//               <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
//             </div>
//           )}
//         </div>
        
//         <button
//           type="submit"
//           disabled={pending}
//         //   className="w-full mt-8 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
//           className="w-full mt-8 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
        
//         >
//           {pending ? (
//             <div className="flex items-center justify-center">
//               <RefreshCwIcon className="animate-spin mr-2" />
//               <span>Guardando...</span>
//             </div>
//           ) : (
//             'Guardar cambios'
//           )}
//         </button>
//       </form>
//     </div>
//   )
// }