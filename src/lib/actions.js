'use server'

import cloudinary from "@/lib/cloudinary"
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth, signIn } from "@/auth";
import { getUserByPhone } from "./data"
import { redirect } from 'next/navigation'
import { Prisma } from "@prisma/client"

// import { signIn } from "next-auth/react"

let lastExecution = 0
let lastExecutionNorma = 0
//--------------- ELIMINAR HORARIO ------------------

export async function eliminarHorario(prevState, formData) {
  const session = await auth();

  if (session?.user?.role !== 'ADMIN') {
    return { error: 'No autorizado' };
  }

  const horarioId = formData.get('horarioId')?.toString();
  if (!horarioId) {
    return { error: 'ID de horario no proporcionado' };
  }

  try {
    // Primero obtenemos el horario para saber su tipo
    const horario = await prisma.horario.findUnique({
      where: { id: horarioId }
    });

    if (!horario) {
      return { error: 'Horario no encontrado' };
    }

    const tipo = horario.tipo;

    // Luego eliminamos
    await prisma.horario.delete({
      where: { id: horarioId }
    });

    // Revalida ambas rutas importantes
    revalidatePath('/clases');
    revalidatePath(`/clases/${tipo}`);
    
    // Devuelve el tipo para que el cliente sepa a dónde redirigir
    return { 
      success: true, 
      message: 'Horario eliminado correctamente',
      tipo: tipo
    };

  } catch (error) {
    console.error('Error eliminando horario:', error);
    return { error: 'Error al eliminar el horario' };
  }
}
// ---------------EDITAR HORARIO ------------------

export async function editarHorario(prevState, formData) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') return { error: 'No autorizado' };

  try {
    // Obtener valores originales primero
    const horarioOriginal = await prisma.horario.findUnique({
      where: { id: formData.get('horarioId') }
    });

    if (!horarioOriginal) return { error: 'Horario no encontrado' };

    // Obtener valores editados o mantener originales
    const nuevosValores = {
      dia: formData.get('dia') || horarioOriginal.dia,
      hora: formData.get('hora') || horarioOriginal.hora,
      tipo: horarioOriginal.tipo // Mantener el tipo original
    };

    // Verificar si hay cambios
    const mismosValores =
      nuevosValores.dia === horarioOriginal.dia &&
      nuevosValores.hora === horarioOriginal.hora;

    if (mismosValores) return { error: 'No se realizaron cambios' };

    // Verificar colisiones
    const conflicto = await prisma.horario.findFirst({
      where: {
        AND: [
          { dia: nuevosValores.dia },
          { hora: nuevosValores.hora },
          { tipo: nuevosValores.tipo },
          { NOT: { id: horarioOriginal.id } }
        ]
      }
    });

    if (conflicto) return { error: 'Ya existe un horario con estos valores' };

    // Actualizar
    await prisma.horario.update({
      where: { id: horarioOriginal.id },
      data: nuevosValores
    });

    revalidatePath(`/clases/${nuevosValores.tipo}`);
    return { success: true };

  } catch (error) {
    console.error('Error en editarHorario:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          return { error: 'Conflicto: Horario duplicado' };
        case 'P2025':
          return { error: 'El horario no existe' };
      }
    }

    return { error: 'Error al actualizar. Intente nuevamente.' };
  }
}

// --------------- CREAR HORARIO ------------------

export async function crearHorario(prevState, formData) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { error: 'No autorizado' };
  }

  // Obtener valores con validación mejorada
  const getValue = (field) => {
    const value = formData.get(field);
    return value?.toString().trim() || null;
  };

  const rawData = {
    dia: getValue('dia'),
    hora: getValue('hora'),
    tipo: getValue('tipo')
  };

  // Validación completa
  if (Object.values(rawData).some(v => !v)) {
    return { error: 'Todos los campos son requeridos' };
  }

  try {
    // Verificación de existencia
    const existe = await prisma.horario.findFirst({
      where: {
        AND: [
          { dia: rawData.dia },
          { hora: rawData.hora },
          { tipo: rawData.tipo }
        ]
      }
    });

    if (existe) return { error: 'Ya existe un horario con estos valores' };

    // Crear registro
    await prisma.horario.create({
      data: rawData
    });

    revalidatePath(`/clases/${rawData.tipo}`);
    return { success: true };

  } catch (error) {
    console.error('Error en crearHorario:', error);

    // Manejo específico de error de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { error: 'Ya existe un horario con estos valores' };
      }
    }

    return { error: 'Error al crear el horario. Intente nuevamente.' };
  }
}
// ---------------OBTENER TODAS LAS RESERVAS------------------
export async function getTodasReservas() {
  return await prisma.reserva.findMany({
    include: {
      horario: true,
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
}

export async function cancelarReservaAdmin(horarioId, tipo, userId) {
  const session = await auth();
  if (!session?.user?.role === "ADMIN") throw new Error("No autorizado");

  await prisma.reserva.deleteMany({
    where: { userId, horarioId }
  });

  revalidatePath("/agenda");
}

// ------------------------ RESERVAS --------------------------------

export async function getReservasDelUsuario(userId) {
  return await prisma.reserva.findMany({
    where: { userId },
    include: {
      horario: {
        include: {
          _count: {
            select: { reservas: true } // Incluir conteo de reservas
          }
        }
      }
    }
  });
}

// ------------------------ APUNTARSE A HORARIO --------------------------------
export async function apuntarseAHorario(horarioId, tipo) {
  const session = await auth();
  if (!session) throw new Error("No autenticado");

  const userId = session.user.id;

  const yaReservado = await prisma.reserva.findFirst({
    where: { userId, horarioId },
  });

  if (yaReservado) {
    throw new Error("Ya estás apuntado a este horario.");
  }

  const total = await prisma.reserva.count({
    where: { horarioId },
  });

  if (total >= 6) {
    throw new Error("Este horario ya está completo.");
  }

  await prisma.reserva.create({
    data: {
      userId,
      horarioId,
      fechaReal: new Date(),
    },
  });

  // Revalida la ruta correspondiente al tipo
  revalidatePath(`/clases/${tipo}`);
}


export async function cancelarReserva(horarioId, tipo) {
  const session = await auth();
  if (!session) throw new Error("No autenticado");

  const userId = session.user.id;

  await prisma.reserva.deleteMany({
    where: {
      userId,
      horarioId,
    },
  });

  revalidatePath(`/clases/${tipo}`);
}

// export async function register(prevState, formData) {
//   const name = formData.get('name');
//   const address = formData.get('address');
//   const phone = formData.get('phone');
//   const password = formData.get('password');

//   try {
//     // Validación básica
//     if (!phone.match(/^\d{9}$/)) {
//       return { error: 'El teléfono debe tener 9 dígitos' };
//     }

//     // Verificar usuario existente
//     const existingUser = await prisma.user.findUnique({
//       where: { phone }
//     });

//     if (existingUser) {
//       return { error: 'Este teléfono ya está registrado' };
//     }

//     // Encriptación correcta de la contraseña
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Crear usuario en la base de datos
//     await prisma.user.create({
//       data: {
//         name,
//         address,
//         phone,
//         password: hashedPassword,
//         role: 'USER' // Asignar rol por defecto
//       }
//     });

//     return { success: "¡Registro exitoso! Ya puedes iniciar sesión" };

//   } catch (error) {
//     console.error('Error en registro:', error);
//     return { error: 'Error al crear el usuario. Inténtalo de nuevo.' };
//   }
// }

export async function register(prevState, formData) {
  const name = formData.get('name');
  const address = formData.get('address');
  const phone = formData.get('phone');
  const password = formData.get('password');
  const paidSessions = formData.getAll('paidSessions'); // Array de tipos de sesiones

  try {
    if (!phone.match(/^\d{9}$/)) {
      return { error: 'El teléfono debe tener 9 dígitos' };
    }

    const existingUser = await prisma.user.findUnique({
      where: { phone }
    });

    if (existingUser) {
      return { error: 'Este teléfono ya está registrado' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        address,
        phone,
        password: hashedPassword,
        role: 'USER',
        paidSessions: {
          create: paidSessions.map(sessionType => ({
            sessionType: sessionType
          }))
        }
      }
    });

    return { success: "¡Registro exitoso! Ya puedes iniciar sesión" };

  } catch (error) {
    console.error('Error en registro:', error);
    return { error: 'Error al crear el usuario. Inténtalo de nuevo.' };
  }
}

// LOGOUT
export async function logout() {
  try {
    await signOut({ redirectTo: '/' })
  } catch (error) {
    throw error
  }
}


// ------------------------  UPLOAD IMAGE --------------------------------

async function uploadImage(file) {

  const fileBuffer = await file.arrayBuffer();

  let mime = file.type;
  let encoding = "base64";
  let base64Data = Buffer.from(fileBuffer).toString("base64");
  let fileUri = "data:" + mime + ";" + encoding + "," + base64Data;

  try {
    const result = await cloudinary.uploader.upload(fileUri, {
      invalidate: true,
      folder: "pizzeria",
      public_id: file.name.split(".").slice(0, -1).join("."),
      aspect_ratio: "1.0",
      width: 800,
      crop: "fill",
      gravity: "center",
      format: 'avif'
    });
    // console.log(result);
    return result.secure_url;
  } catch (error) {
    console.log(error);
    return null;
  }
}


// ------------------------  USERS --------------------------------
export async function newUser(prevState, formData) {
  try {
    const name = formData.get('name');
    const email = formData.get('email');
    const image = formData.get('image');

    await prisma.user.create({
      data: { name, email, image },
    })

    revalidatePath('/dashboard')
    return { success: 'Usuario guardado' }
  } catch (error) {
    return { error }
  }

}

// editUser------------------------

// export async function editUser(prevState, formData) {
//   const id = formData.get('id')
//   const name = formData.get('name')
//   const address = formData.get('address')
//   const email = formData.get('email')
//   const image = formData.get('image')
//   const phone = formData.get('phone')
//   const role = formData.get('role')
//   const password = formData.get('password')

//   const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/
//   if (!nameRegex.test(name)) {
//     return { error: 'El nombre solo puede contener letras y espacios' }
//   }

//   // Validar si el nombre ya existe
//   const existingUserByName = await prisma.user.findFirst({
//     where: {
//       name,
//       NOT: { id },
//     },
//   })

//   if (existingUserByName) {
//     return { error: 'Este nombre ya está registrado' }
//   }

//   const phoneRegex = /^[0-9]+$/
//   if (!phoneRegex.test(phone)) {
//     return { error: 'El teléfono solo puede contener números' }
//   }

//   // Validar si el teléfono ya existe
//   if (phone) {
//     const existingUserByPhone = await prisma.user.findFirst({
//       where: {
//         phone,
//         NOT: { id },
//       },
//     })

//     if (existingUserByPhone) {
//       return { error: 'Este número de teléfono ya está registrado' }
//     }
//   }

//   let hashedPassword
//   if (password) {
//     hashedPassword = await bcrypt.hash(password, 10)
//   }

//   // Obtener el usuario actual
//   const user = await prisma.user.findUnique({ where: { id } })
//   if (!user) {
//     return { error: 'Usuario no encontrado' }
//   }

//   // Prevenir cambio de rol si es el jefe
//   const isJefe = id === 'cmaf8dd9v0002vhiwojgid5lp'
//   if (isJefe && role && role !== user.role) {
//     return { error: 'No se puede cambiar el rol del jefe.' }
//   }

//   try {
//     await prisma.user.update({
//       where: { id },
//       data: {
//         name,
//         address,
//         email,
//         image,
//         phone,
//         ...(password && { password: hashedPassword }),
//         ...(!isJefe && role && { role }),
//       },
//     })

//     revalidatePath('/perfil')
//     revalidatePath('/users')
//     return { success: 'Usuario actualizado correctamente' }
//   } catch (error) {
//     console.error('Error updating user:', error)
//     return { error: 'Error al actualizar el usuario' }
//   }
// }

export async function editUser(prevState, formData) {
  const id = formData.get('id')
  const name = formData.get('name')
  const address = formData.get('address')
  const email = formData.get('email')
  const image = formData.get('image')
  const phone = formData.get('phone')
  const role = formData.get('role')
  const password = formData.get('password')
  const paidSessions = formData.getAll('paidSessions') // Array de tipos de sesiones

  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/
  if (!nameRegex.test(name)) {
    return { error: 'El nombre solo puede contener letras y espacios' }
  }

  const existingUserByName = await prisma.user.findFirst({
    where: {
      name,
      NOT: { id },
    },
  })

  if (existingUserByName) {
    return { error: 'Este nombre ya está registrado' }
  }

  const phoneRegex = /^[0-9]+$/
  if (!phoneRegex.test(phone)) {
    return { error: 'El teléfono solo puede contener números' }
  }

  if (phone) {
    const existingUserByPhone = await prisma.user.findFirst({
      where: {
        phone,
        NOT: { id },
      },
    })

    if (existingUserByPhone) {
      return { error: 'Este número de teléfono ya está registrado' }
    }
  }

  let hashedPassword
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10)
  }

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    return { error: 'Usuario no encontrado' }
  }

  const isJefe = id === 'cmaf8dd9v0002vhiwojgid5lp'
  if (isJefe && role && role !== user.role) {
    return { error: 'No se puede cambiar el rol del jefe.' }
  }

  try {
    await prisma.$transaction([
      // Actualizar datos básicos del usuario
      prisma.user.update({
        where: { id },
        data: {
          name,
          address,
          email,
          image,
          phone,
          ...(password && { password: hashedPassword }),
          ...(!isJefe && role && { role }),
        },
      }),
      
      // Eliminar sesiones pagadas existentes
      prisma.paidSession.deleteMany({
        where: { userId: id }
      }),
      
      // Crear nuevas sesiones pagadas
      ...(paidSessions.length > 0 ? [
        prisma.paidSession.createMany({
          data: paidSessions.map(sessionType => ({
            userId: id,
            sessionType: sessionType
          }))
        })
      ] : [])
    ])

    revalidatePath('/perfil')
    revalidatePath('/users')
    return { success: 'Usuario actualizado correctamente' }
  } catch (error) {
    console.error('Error updating user:', error)
    return { error: 'Error al actualizar el usuario' }
  }
}
// ------------------------ deleteUser------------------------

export async function deleteUser(prevState, formData) {
  try {
    const id = formData.get('id')

    // Mensaje especial si es el jefe (antes de consultar la base de datos)
    if (id === 'cmaf8dd9v0002vhiwojgid5lp') {
      return { error: 'No se puede eliminar al jefe.' }
    }

    // Obtener el usuario para verificar su rol
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return { error: 'Usuario no encontrado.' }
    }

    // Evitar eliminación si el rol es ADMIN
    if (user.role === 'ADMIN') {
      return { error: 'No se puede eliminar un usuario con rol ADMIN.' }
    }

    await prisma.user.delete({
      where: { id },
    })

    revalidatePath('/dashboard')
    return { success: 'Usuario eliminado' }
  } catch (error) {
    return { error: error.message || 'Error al eliminar el usuario' }
  }
}


// //  ------------------------ NOTIFICACIONES ------------------------
// export async function crearNotificacion(formData) {
//   const session = await auth()

//   if (!session?.user || session.user.role !== 'ADMIN') {
//     throw new Error('No autorizado')
//   }

//   const title = formData.get('title')
//   const message = formData.get('message')

//   await prisma.notification.create({
//     data: {
//       title,
//       message,
//       createdBy: session.user.id,
//     },
//   })

//   redirect('/notificaciones')
// }
//---------------- EDITAR NOTIFICACION ------------------

// export async function editarNotificacion(id, formData) {
//   const session = await auth()

//   if (!session?.user || session.user.role !== 'ADMIN') {
//     throw new Error('No autorizado')
//   }

//   const title = formData.get('title')
//   const message = formData.get('message')

//   await prisma.notification.update({
//     where: { id },
//     data: {
//       title,
//       message,
//     },
//   })

//   redirect('/notificaciones')
// }


//---------------- ELIMINAR NOTIFICACION ------------------
// export async function eliminarNotificacion(id) {
//   const session = await auth()

//   if (!session?.user || session.user.role !== 'ADMIN') {
//     throw new Error('No autorizado')
//   }

//   await prisma.notification.delete({
//     where: { id }
//   })

//   redirect('/notificaciones') // recarga la página
// }

// LOGIN

export async function authenticate(prevState, formData) {
  try {
    const phone = formData.get('phone');
    const password = formData.get('password');
    const callbackUrl = formData.get('callbackUrl') || '/home';

    // Validación del servidor
    if (!phone || !/^\d{9}$/.test(phone)) {
      throw new Error('invalid_format');
    }

    const response = await signIn('credentials', {
      redirect: false,
      phone,
      password,
      callbackUrl: process.env.NEXTAUTH_URL + callbackUrl
    });

    if (response?.error) {
      throw new AuthError(response.error);
    }

    return { success: true, url: response?.url || callbackUrl };

  } catch (error) {
    console.error('Auth Error:', error);

    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'invalid_credentials' };
        default:
          return { error: 'server_error' };
      }
    }
    return { error: error.message || 'server_error' };
  }
}

// clases contadas
export async function getClassCounts() {
  try {
    // Obtener todos los horarios con el conteo de sus reservas
    const horariosConReservas = await prisma.horario.findMany({
      include: {
        _count: {
          select: { reservas: true }
        }
      }
    });

    // Filtrar solo los horarios que tienen menos de 6 reservas
    const horariosDisponibles = horariosConReservas.filter(
      horario => horario._count.reservas < 6
    );

    // Agrupar manualmente por tipo
    const counts = horariosDisponibles.reduce((acc, horario) => {
      const tipo = horario.tipo.toLowerCase();
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});

    // Asegurar que todos los tipos tengan un valor
    return {
      pilates: counts.pilates || 0,
      rehabilitacion_funcional: counts.rehabilitacion_funcional || 0,
      entrenamiento_personal: counts.entrenamiento_personal || 0
    };
  } catch (error) {
    console.error("Error fetching class counts:", error);
    return {
      pilates: 0,
      rehabilitacion_funcional: 0,
      entrenamiento_personal: 0
    };
  }
}

export async function crearNotificacion(formData) {
  const now = Date.now()
  if (now - lastExecution < 2000) return // Bloquear por 2 segundos
  lastExecution = now

  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') throw new Error('No autorizado')

    const title = formData.get('title')
    const message = formData.get('message')

    await prisma.notification.create({
      data: {
        title,
        message,
        createdBy: session.user.id,
      },
    })
  } finally {
    // No necesitamos resetear ya que usamos timestamp
  }
  
  redirect('/notificaciones')
}

// Editar notificación
export async function editarNotificacion(id, formData) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') throw new Error('No autorizado')

  const title = formData.get('title')
  const message = formData.get('message')

  await prisma.notification.update({
    where: { id },
    data: { title, message },
  })

  redirect('/notificaciones')
}

// Eliminar notificación
export async function eliminarNotificacion(formData) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') throw new Error('No autorizado')

  const id = formData.get('id')
  await prisma.notification.delete({ where: { id } })

  redirect('/notificaciones')
}

export async function crearNorma(formData) {
  const now = Date.now()
  if (now - lastExecutionNorma < 2000) return // Bloqueo de 2 segundos
  lastExecutionNorma = now

  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      throw new Error('No autorizado')
    }

    const titulo = formData.get('titulo')?.toString()
    const contenido = formData.get('contenido')?.toString()
    const publicada = formData.get('publicada') === 'on'

    if (!titulo || !contenido) {
      throw new Error('Título y contenido son obligatorios')
    }

    await prisma.norma.create({
      data: {
        titulo,
        contenido,
        publicada,
        autorId: session.user.id,
      },
    })
  } finally {
    // No se reinicia el contador porque usamos timestamps
  }

  redirect('/normas')
}

export async function editarNorma(id, formData) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('No autorizado')
  }

  const titulo = formData.get('titulo')?.toString()
  const contenido = formData.get('contenido')?.toString()
  const publicada = formData.get('publicada') === 'on'

  if (!titulo || !contenido) {
    throw new Error('Título y contenido son obligatorios')
  }

  await prisma.norma.update({
    where: { id },
    data: {
      titulo,
      contenido,
      publicada,
      autorId: session.user.id,
    },
  })

  redirect('/normas')
}

export async function eliminarNorma(formData) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('No autorizado')
  }

  const id = formData.get('id')
  if (!id) throw new Error('ID no proporcionado')

  await prisma.norma.delete({ where: { id } })

  redirect('/normas')
}

// lib/actions.js
export async function getUnviewedNotifications(userId) {
  const notifications = await prisma.notification.findMany({
    where: {
      viewed: false,
      createdBy: userId,
    },
  });
  return notifications;
}
