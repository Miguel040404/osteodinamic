'use server'
import cloudinary from "@/lib/cloudinary"
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from "@/auth"; 
import { getUserByPhone } from "./data"
import { redirect } from 'next/navigation'
import { Prisma } from "@prisma/client"

//--------------- ELIMINAR HORARIO ------------------

export async function eliminarHorario(prevState, formData) {
  const session = await auth();

  if (session?.user?.role !== 'ADMIN') {
    return { error: 'No autorizado' };
  }

  // Obtener y validar el ID
  const horarioId = formData.get('horarioId')?.toString();
  
  if (!horarioId) {
    return { error: 'ID de horario no proporcionado' };
  }

  try {
    await prisma.horario.delete({
      where: { id: horarioId }
    });
    
    revalidatePath('/clases');
    return { success: true, message: 'Horario eliminado correctamente' };
    
  } catch (error) {
    console.error('Error eliminando horario:', error);
    return { error: 'Error al eliminar el horario' };
  }
}

//---------------EDITAR HORARIO ------------------

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


// REGISTER qie encripta
// export async function register(prevState, formData) {
//     const name = formData.get('name')
//     const phone = formData.get('phone')
//     const password = formData.get('password')

//     // Comprobamos si el usuario ya está registrado
//     const user = await getUserByPhone(phone);

//     if (user) {
//         return { error: 'El email ya está registrado' }
//     }

//     // Encriptamos password 
//     const hashedPassword = await bcrypt.hash(password, 10)

//     // Guardamos credenciales en base datos
//     await prisma.user.create({
//         data: {
//             name,
//             phone,
//             password: hashedPassword
//         }
//     })

//     return { success: "Registro correcto" }
// }
export async function register(prevState, formData) {
  const name = formData.get('name');
  const phone = formData.get('phone');
  const password = formData.get('password');

  try {
    // Validación básica
    if (!phone.match(/^\d{9}$/)) {
      return { error: 'El teléfono debe tener 9 dígitos' };
    }

    if (password.length < 6) {
      return { error: 'La contraseña debe tener al menos 6 caracteres' };
    }

    // Verificar usuario existente
    const existingUser = await prisma.user.findUnique({
      where: { phone }
    });

    if (existingUser) {
      return { error: 'Este teléfono ya está registrado' };
    }

    // Encriptación correcta de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario en la base de datos
    await prisma.user.create({
      data: {
        name,
        phone,
        password: hashedPassword,
        role: 'USER' // Asignar rol por defecto
      }
    });

    return { success: "¡Registro exitoso! Ya puedes iniciar sesión" };

  } catch (error) {
    console.error('Error en registro:', error);
    return { error: 'Error al crear el usuario. Inténtalo de nuevo.' };
  }
}
// FUNKA
// export async function register(prevState, formData) {
//     const name = formData.get('name')
//     const phone = formData.get('phone')
//     const password = formData.get('password')

//     // Comprobamos si el usuario ya está registrado
//     const user = await getUserByPhone(phone);

//     if (user) {
//         return { error: 'El email ya está registrado' }
//     }

//     // Guardamos credenciales en base datos sin encriptar
//     await prisma.user.create({
//         data: {
//             name,
//             phone,
//             password
//         }
//     })

//     return { success: "Registro correcto" }
// }

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

        await prisma.user.create({
            data: { name, email },
        })

        revalidatePath('/dashboard')
        return { success: 'Usuario guardado' }
    } catch (error) {
        return { error }
    }

}

// editUser------------------------

// // FUNKA
// export async function editUser(prevState, formData) {
//   const id = formData.get('id')
//   const name = formData.get('name')
//   const email = formData.get('email')
//   const phone = formData.get('phone')
//   const role = formData.get('role')
//   const password = formData.get('password')

//   const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
//   if (!nameRegex.test(name)) {
//     return { error: 'El nombre solo puede contener letras y espacios' };
//   }

//   // Validar si el nombre ya existe
//   const existingUserByName = await prisma.user.findFirst({
//     where: {
//       name,
//       NOT: { id }
//     }
//   });

//   if (existingUserByName) {
//     return { error: 'Este nombre ya está registrado' };
//   }

//   const phoneRegex = /^[0-9]+$/;
//   if (!phoneRegex.test(phone)) {
//     return { error: 'El teléfono solo puede contener números' };
//   }
//   // Validar si el teléfono ya existe
//   if (phone) {
//     const existingUserByPhone = await prisma.user.findFirst({
//       where: {
//         phone,
//         NOT: { id }
//       }
//     });

//     if (existingUserByPhone) {
//       return { error: 'Este número de teléfono ya está registrado' };
//     }
//   }

//   // Actualizar
//   try {
//     await prisma.user.update({
//       where: { id },
//       data: {
//         name,
//         email,
//         phone,
//         password,
//         ...(role && { role })
//       }
//     });

//     revalidatePath('/perfil')
//     revalidatePath('/users')
//     return { success: 'Usuario actualizado correctamente' }
//   } catch (error) {
//     console.error("Error updating user:", error)
//     return { error: 'Error al actualizar el usuario' }
//   }
// }



const SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_SECRET || 'clave-secreta'

export async function editUser(prevState, formData) {
    const id = formData.get('id')
    const name = formData.get('name')
    const phone = formData.get('phone')
    const role = formData.get('role')
    const rawPassword = formData.get('password')

    // Validaciones
    if (!phone.match(/^\d{9}$/)) {
        return { error: 'Teléfono inválido (9 dígitos requeridos)' }
    }

    if (rawPassword.length < 6) {
        return { error: 'La contraseña debe tener mínimo 6 caracteres' }
    }

    // Cifrar contraseña
    const encryptedPassword = CryptoJS.AES
        .encrypt(rawPassword, SECRET_KEY)
        .toString()

    try {
        await prisma.user.update({
            where: { id },
            data: {
                name,
                phone,
                role,
                password: encryptedPassword
            }
        })

        revalidatePath('/perfil')
        revalidatePath('/users')
        return { success: 'Usuario actualizado' }
    } catch (error) {
        console.error("Error actualizando usuario:", error)
        return { error: 'Error al actualizar el usuario' }
    }
}


export async function deleteUser(prevState, formData) {
    try {
        const id = formData.get('id')

        await prisma.user.delete({
            where: { id },
        })
        revalidatePath('/dashboard')
        return { success: 'Usuario eliminado' }
    } catch (error) {
        return { error }
    }
}


// //  ------------------------ NOTIFICACIONES ------------------------
export async function crearNotificacion(formData) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('No autorizado')
  }

  const title = formData.get('title')
  const message = formData.get('message')

  await prisma.notification.create({
    data: {
      title,
      message,
      createdBy: session.user.id,
    },
  })

  redirect('/notificaciones')
}

//---------------- ELIMINAR NOTIFICACION ------------------
export async function eliminarNotificacion(id) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('No autorizado')
  }

  await prisma.notification.delete({
    where: { id }
  })

  redirect('/notificaciones') // recarga la página
}