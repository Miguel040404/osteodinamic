'use server'

import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth, signIn } from "@/auth";
import { redirect } from 'next/navigation'
import { Prisma } from "@prisma/client"

let lastExecution = 0
let lastExecutionNorma = 0

//-------------------- HORARIOS ---------------------
export async function eliminarHorario(prevState, formData) {
  try {
    const session = await auth();
    if (!session?.user?.role === 'ADMIN') {
      throw new Error('No autorizado');
    }

    const horarioId = formData.get('horarioId')?.toString();
    if (!horarioId) {
      throw new Error('ID de horario no proporcionado');
    }

    const horario = await prisma.horario.delete({
      where: { id: horarioId }
    });

    if (!horario) {
      throw new Error('Horario no encontrado');
    }

    // Revalidar rutas relevantes
    await Promise.allSettled([
      revalidatePath('/clases'),
      revalidatePath(`/clases/${horario.tipo}`)
    ]);

    return {
      success: true,
      message: 'Horario eliminado correctamente',
      tipo: horario.tipo
    };

  } catch (error) {
    console.error('Error eliminando horario:', error);
    return {
      error: error.message || 'Error al eliminar el horario'
    };
  }
}

// --------------- EDITAR HORARIO ------------------
export async function editarHorario(prevState, formData) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') return { error: 'No autorizado' };

  try {

    const horarioOriginal = await prisma.horario.findUnique({
      where: { id: formData.get('horarioId') }
    });

    if (!horarioOriginal) return { error: 'Horario no encontrado' };

    // Obtener valores editados o mantener originales
    const nuevosValores = {
      dia: formData.get('dia') || horarioOriginal.dia,
      hora: formData.get('hora') || horarioOriginal.hora,
      tipo: horarioOriginal.tipo,
      sala: formData.get('sala') || horarioOriginal.sala
    };

    // Verificar si hay cambios
    const mismosValores =
      nuevosValores.dia === horarioOriginal.dia &&
      nuevosValores.hora === horarioOriginal.hora &&
      nuevosValores.sala === horarioOriginal.sala;

    if (mismosValores) return { error: 'No se realizaron cambios' };

    // Verificar colisiones
    const conflicto = await prisma.horario.findFirst({
      where: {
        AND: [
          { dia: nuevosValores.dia },
          { hora: nuevosValores.hora },
          { tipo: nuevosValores.tipo },
          { sala: nuevosValores.sala },
          { NOT: { id: horarioOriginal.id } }
        ]
      }
    });

    if (conflicto) return { error: 'Ya existe un horario con estos valores' };

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

  // Convierte a string, elimina espacios y maneja valores undefined/null
  const getValue = (field) => {
    const value = formData.get(field);
    return value?.toString().trim() || null;
  };

  //Valores por defecto
  const rawData = {
    dia: getValue('dia'),
    hora: getValue('hora'),
    tipo: getValue('tipo'),
    sala: getValue('sala') || 'Sala 1'
  };

  // Validación completa
  if (Object.values(rawData).some(v => !v)) {
    return { error: 'Todos los campos son requeridos' };
  }

  try {
    const existe = await prisma.horario.findFirst({
      where: {
        AND: [
          { dia: rawData.dia },
          { hora: rawData.hora },
          { tipo: rawData.tipo },
          { sala: rawData.sala } // Incluir sala
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

// export async function apuntarseAHorario(horarioId, tipo) {
//   const session = await auth();
//   if (!session) throw new Error("No autenticado");

//   const userId = session.user.id;

//   const yaReservado = await prisma.reserva.findFirst({
//     where: { userId, horarioId },
//   });

//   if (yaReservado) {
//     throw new Error("Ya estás apuntado a este horario.");
//   }

//   const total = await prisma.reserva.count({
//     where: { horarioId },
//   });

//   if (total >= 6) {
//     throw new Error("Este horario ya está completo.");
//   }

//   await prisma.reserva.create({
//     data: {
//       userId,
//       horarioId,
//       fechaReal: new Date(),
//     },
//   });

//   revalidatePath(`/clases/${tipo}`);
// }

export async function apuntarseAHorario(prevState, formData) {

  const tipo = formData.get('tipo')?.toString();
  const horarioId = formData.get('horarioId')?.toString();

  const session = await auth();
  if (!session) throw new Error("No autenticado");

  const userId = session.user.id;

  // Obtener detalles del horario seleccionado
  const horarioTarget = await prisma.horario.findUnique({
    where: { id: horarioId },
  });

  if (!horarioTarget) {
    throw new Error("Horario no encontrado");
  }

  // Verificar si ya tiene reserva en la MISMA HORA Y DÍA (cualquier sala)
  const reservaSolapada = await prisma.reserva.findFirst({
    where: {
      userId,
      horario: {
        dia: horarioTarget.dia,
        hora: horarioTarget.hora
      }
    },
    include: { horario: true }
  });

  if (reservaSolapada) {
    throw new Error(
      `Ya estás apuntado a ${reservaSolapada.horario.sala} a esta misma hora`
    );
  }

  // Verificar si ya está apuntado a este horario específico
  const yaReservado = await prisma.reserva.findFirst({
    where: { userId, horarioId },
  });

  if (yaReservado) {
    throw new Error("Ya estás apuntado a este horario");
  }

  // Verificar capacidad máxima
  const total = await prisma.reserva.count({
    where: { horarioId },
  });

  if (total >= 6) {
    throw new Error("Este horario ya está completo");
  }

  // Crear la reserva
  await prisma.reserva.create({
    data: {
      userId,
      horarioId,
      fechaReal: new Date(),
    },
  });

  revalidatePath(`/clases/${tipo}`);
}

// ----------------- RESERVAS ------------------
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

export async function cancelarReserva(prevState, formData) {

    const tipo = formData.get('tipo')?.toString();
  const horarioId = formData.get('horarioId')?.toString();
   
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

// LOGOUT
export async function logout() {
  try {
    await signOut({ redirectTo: '/' })
  } catch (error) {
    throw error
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


export async function editUser(prevState, formData) {
  const session = await auth();
  const editor = session?.user;

  if (!editor) {
    return { error: 'No autorizado' };
  }

  const isEditorAdmin = editor.role === 'ADMIN';
  const id = formData.get('id');
  const name = formData.get('name');
  const address = formData.get('address');
  const email = formData.get('email');
  const image = formData.get('image');
  const phone = formData.get('phone');
  const role = formData.get('role');
  const password = formData.get('password');

  // Obtener sesiones pagadas solo si es Admin
  const paidSessions = isEditorAdmin
    ? formData.getAll('paidSessions')
    : [];

  // Validaciones...
  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  if (!nameRegex.test(name)) {
    return { error: 'El nombre solo puede contener letras y espacios' };
  }
  const phoneRegex = /^[0-9]{9}$/;
  if (!phoneRegex.test(phone)) {
    return { error: 'El teléfono debe tener exactamente 9 dígitos' };
  }

  // Usuarios duplicados
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { name, NOT: { id } },
        { phone, NOT: { id } }
      ]
    }
  });

  if (existingUser) {
    if (existingUser.name === name) {
      return { error: 'Este nombre ya está registrado' };
    }
    if (existingUser.phone === phone) {
      return { error: 'Este teléfono ya está registrado' };
    }
  }

  // Detectar jefe
  const jefeId = 'cmaf8dd9v0002vhiwojgid5lp';
  const isJefe = id === jefeId;

  // No permitir cambiar datos del jefe
  if (isJefe && role && role !== editor.role) {
    return { error: 'No se puede cambiar el rol del jefe.' };
  }

  if (isJefe && password) {
    return { error: 'No se puede editar datos personales del jefe.' };
  }

  if (isJefe && phone && phone !== editor.phone) {
    return { error: 'No se puede editar datos personales del jefe.' };
  }

  if (isJefe && address && address !== editor.address) {
    return { error: 'No se puede editar datos personales del jefe.' };
  }

  if (isJefe && name && name !== editor.name) {
    return { error: 'No se puede editar datos personales del jefe.' };
  }

  try {
    // Actualizar datos; **no** incluir password si es el jefe
    await prisma.user.update({
      where: { id },
      data: {
        name,
        address,
        email,
        image,
        phone,
        // SOLO aplicar hash de password si NO es el jefe
        ...(!isJefe && password
          ? { password: await bcrypt.hash(password, 10) }
          : {}),
        // Rol solo si es admin y no es jefe
        ...(isEditorAdmin && role && !isJefe ? { role } : {}),
      },
    });

    // Gestionar paidSessions solo si es admin
    if (isEditorAdmin) {
      await prisma.paidSession.deleteMany({ where: { userId: id } });
      if (paidSessions.length > 0) {
        await prisma.paidSession.createMany({
          data: paidSessions.map(sessionType => ({
            userId: id,
            sessionType
          }))
        });
      }
    }

    // Revalidar rutas
    revalidatePath('/perfil');
    revalidatePath('/users');
    return { success: 'Usuario actualizado correctamente' };
  } catch (error) {
    console.error('Error updating user:', error);
    return { error: 'Error al actualizar el usuario' };
  }
}

export async function register(prevState, formData) {
  const session = await auth();
  const creator = session?.user;
  const isAdmin = creator?.role === 'ADMIN';

  const name = formData.get('name');
  const address = formData.get('address');
  const phone = formData.get('phone');
  const password = formData.get('password');
  const paidSessions = isAdmin
    ? formData.getAll('paidSessions')
    : [];

  try {
    if (!phone.match(/^\d{9}$/)) {
      return { error: 'El teléfono debe tener 9 dígitos' };
    }

    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!nameRegex.test(name)) {
      return { error: 'El nombre solo puede contener letras y espacios' };
    }

    const existingUser = await prisma.user.findUnique({
      where: { phone }
    });

    if (existingUser) {
      return { error: 'Este teléfono ya está registrado' };
    }

    const userData = {
      name,
      address,
      phone,
      password: await bcrypt.hash(password, 10),
      role: 'USER',
    };

    // Si es admin y hay sesiones seleccionadas, añadirlas
    if (isAdmin && paidSessions.length > 0) {
      userData.paidSessions = {
        create: paidSessions.map(sessionType => ({ sessionType }))
      };
    }

    await prisma.user.create({ data: userData });

    return { success: "¡Registro exitoso! Ya puedes iniciar sesión" };
  } catch (error) {
    console.error('Error en registro:', error);
    return { error: 'Error al crear el usuario. Inténtalo de nuevo.' };
  }
}

export async function deleteUser(prevState, formData) {
  const session = await auth();
  const editor = session?.user;
  const jefeId = 'cmaf8dd9v0002vhiwojgid5lp';
  const id = formData.get('id');

  if (!editor) {
    return { error: 'No autorizado.' };
  }

  if (editor.id !== jefeId) {
    return { error: 'Solo el jefe puede eliminar usuarios.' };
  }

  if (id === jefeId) {
    return { error: 'No se puede eliminar al jefe.' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return { error: 'Usuario no encontrado.' };
    }

    await prisma.user.delete({
      where: { id },
    });

    revalidatePath('/dashboard');
    revalidatePath('/users');
    return { success: 'Usuario eliminado correctamente.' };
  } catch (error) {
    console.error(error);
    return { error: 'Error al eliminar el usuario.' };
  }
}

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



// ------------------------ NOTIFICACIONES ------------------------
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

export async function eliminarNotificacion(formData) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') throw new Error('No autorizado')

  const id = formData.get('id')
  await prisma.notification.delete({ where: { id } })

  redirect('/notificaciones')
}

export async function marcarNotificacionLeida(prevState, formData) {
  const session = await auth();
  const notificationId = formData.get('id');

  // Se busca la notificación para ver quiénes la han visto
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
    include: { viewed: true }
  });

  // Verifica si el usuario ya ha visto la notificación
  const hasViewed = notification.viewed.some(user => user.id === session.user.id);

  if (hasViewed) {
    // Si el usuario ya ha visto la notificación, desconéctalo
    await prisma.notification.update({
      where: { id: notificationId },
      data: {
        viewed: {
          disconnect: { id: session.user.id }
        }
      }
    });
  } else {
    // Si el usuario no ha visto la notificación, conéctalo
    await prisma.notification.update({
      where: { id: notificationId },
      data: {
        viewed: {
          connect: { id: session.user.id }
        }
      }
    });
  }

  revalidatePath('/notificaciones');
}

// ------------------------ NORMAS ------------------------
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