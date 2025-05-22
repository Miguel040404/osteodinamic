'use server'
import cloudinary from "@/lib/cloudinary"
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from "@/auth"; 
import { getUserByPhone } from "./data"
import { Prisma } from "@prisma/client"

//---------------eliminar horario------------------

// export async function eliminarHorario(id) {
//   const session = await auth();
//   if (session?.user?.role !== "ADMIN") {
//     throw new Error("No autorizado");
//   }

//   const horario = await prisma.horario.delete({
//     where: { id },
//   });

//   revalidatePath(`/clases/${horario.tipo}`);
// }

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

//---------------editar horario------------------

// sin modal

// export async function editarHorario(id, dia, hora) {
//   const session = await auth();
//   if (session?.user?.role !== "ADMIN") {
//     throw new Error("No autorizado");
//   }

//   try {
//     const horarioActual = await prisma.horario.findUnique({ where: { id } });
//     if (!horarioActual) throw new Error("Horario no encontrado");

//     const actualizado = await prisma.horario.update({
//       where: { id },
//       data: { dia, hora },
//     });

//     revalidatePath(`/clases/${horarioActual.tipo}`);
//     return actualizado;
//   } catch (error) {
//     if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
//       throw new Error("Ya existe una sesión con ese día y hora");
//     }
//     throw error;
//   }
// }

// viejo
// export async function editarHorario(prevState, formData) {
//   const session = await auth();
  
//   if (session?.user?.role !== 'ADMIN') {
//     return { error: 'No autorizado' };
//   }

//   // Validar campos
//   const horarioId = formData.get('horarioId')?.toString();
//   const dia = formData.get('dia')?.toString().trim();
//   const hora = formData.get('hora')?.toString().trim();

//   if (!horarioId || !dia || !hora) {
//     return { error: 'Todos los campos son requeridos' };
//   }

//   try {
//     // Verificar existencia
//     const horarioExistente = await prisma.horario.findUnique({
//       where: { id: horarioId }
//     });

//     if (!horarioExistente) {
//       return { error: 'El horario no existe' };
//     }

//     // Actualizar
//     await prisma.horario.update({
//       where: { id: horarioId },
//       data: { dia, hora }
//     });

//     revalidatePath(`/clases/${horarioExistente.tipo}`);
//     return { success: true, message: 'Horario actualizado' };
    
//   } catch (error) {
//     console.error('Error actualizando horario:', error);
//     return { error: 'Error al actualizar el horario' };
//   }
// }

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

//---------------crear horario------------------

// export async function crearHorario(prevState, formData) {
//   const session = await auth();

//   if (session?.user?.role !== "ADMIN") {
//     return { success: false, message: "No autorizado" };
//   }

//   const dia = formData.get("dia")?.toString().trim();
//   const hora = formData.get("hora")?.toString().trim();
//   const tipo = formData.get("tipo")?.toString().trim();

//   if (!dia || !hora || !tipo) {
//     return { success: false, message: "Todos los campos son requeridos" };
//   }

//   try {
//     const horarioExistente = await prisma.horario.findFirst({
//       where: { dia, hora, tipo }
//     });

//     if (horarioExistente) {
//       return { success: false, message: "Ya existe una sesión idéntica" };
//     }

//     await prisma.horario.create({ data: { dia, hora, tipo } });
//     revalidatePath(`/clases/${tipo}`);
//     return { success: true, message: "Horario creado exitosamente" };

//   } catch (error) {
//     console.error("Error creating schedule:", error);
//     return { success: false, message: "Error al crear el horario" };
//   }
// }

// viejo
// export async function crearHorario(prevState, formData) {
//   const session = await auth();

//   if (session?.user?.role !== 'ADMIN') {
//     return { error: 'No autorizado' };
//   }

//   // Obtener y limpiar datos
//   const dia = formData.get('dia')?.toString().trim();
//   const hora = formData.get('hora')?.toString().trim();
//   const tipo = formData.get('tipo')?.toString().trim();

//   // Validación básica
//   if (!dia || !hora || !tipo) {
//     return { error: 'Todos los campos son requeridos' };
//   }

//   try {
//     // Verificar existencia de horario idéntico
//     const existeHorario = await prisma.horario.findFirst({
//       where: {
//         dia: dia,
//         hora: hora,
//         tipo: tipo
//       }
//     });

//     if (existeHorario) {
//       return { error: 'Ya existe una sesión idéntica' };
//     }

//     // Crear nuevo horario
//     await prisma.horario.create({
//       data: { dia, hora, tipo }
//     });

//     revalidatePath(`/clases/${tipo}`);
//     return { success: true, message: 'Horario creado exitosamente' };

//   } catch (error) {
//     console.error('Error creando horario:', error);
//     return { error: 'Error al crear el horario' };
//   }
// }

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
// ---------------TodasReservas------------------


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

// ------------------------ HORARIO --------------------------------

// export async function apuntarseAHorario(horarioId) {
//  const session = await auth();
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

//   revalidatePath("/clases/pilates"); 
// }
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

// ------------------------  cancelarReserva user --------------------------------

// export async function cancelarReserva(horarioId) {
//   const session = await auth();
//   if (!session) throw new Error("No autenticado");

//   const userId = session.user.id;

//   await prisma.reserva.deleteMany({
//     where: {
//       userId,
//       horarioId,
//     },
//   });

//   revalidatePath("/clases/pilates"); 
// }
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
// ------------------------  cancelarReserva admin --------------------------------

// export async function cancelarReservaAdmin(horarioId, tipo, userId) {
//   const session = await auth();
  
//   if (!session?.user) {
//     throw new Error("No autenticado");
//   }
  
//   if (session.user.role !== "ADMIN") {
//     throw new Error("No tienes permisos de administrador");
//   }


//   await prisma.reserva.deleteMany({
//     where: {
//       userId,
//       horarioId,
//     },
//   });

//   revalidatePath(`/clases/${tipo}`);
// }
// ------------------------  AUTH --------------------------------

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
    const name = formData.get('name')
    const phone = formData.get('phone')
    const password = formData.get('password')

    // Comprobamos si el usuario ya está registrado
    const user = await getUserByPhone(phone);

    if (user) {
        return { error: 'El email ya está registrado' }
    }

    // Guardamos credenciales en base datos sin encriptar
    await prisma.user.create({
        data: {
            name,
            phone,
            password
        }
    })

    return { success: "Registro correcto" }
}


// LOGIN credentials
// export async function login(prevState, formData) {
//     const phone = formData.get('phone')
//     const password = formData.get('password')

//     // Comprobamos si el usuario está registrado
//     const user = await getUserByPhone(phone);

//     if (!user) {
//         return { error: 'Usuario no registrado.' }
//     }
//     // Comparamos password 
//     let matchPassword = false

//     if (user.password == null)  // Si no hay contraseña almacenada en BD
//         matchPassword = true
//     else
//         matchPassword = await bcrypt.compare(password, user.password)

//     if (user && matchPassword)  // && user.emailVerified
//     {
//         await signIn('credentials',
//             {
//                 phone, password,
//                 redirectTo: globalThis.callbackUrl
//             })
//         return { success: "Inicio de sesión correcto" }
//     } else {
//         return { error: 'Credenciales incorrectas.' }
//     }

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
    // console.log(file);

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

// export async function editUser(prevState, formData) {
//     const id = formData.get('id')
//     const name = formData.get('name');
//     const email = formData.get('email');


//     try {
//         await prisma.user.update({
//             where: { id },
//             data: { name, email },
//         })
//         revalidatePath('/dashboard')
//         return { success: 'Usuario modificado' }
//     } catch (error) {
//         return { error }
//     }

// }


// export async function editUser(prevState, formData) {
//     const id = formData.get('id');
//     const name = formData.get('name');
//     const email = formData.get('email');

//     console.log("Updating user with ID:", id, "Name:", name, "Email:", email);

//     try {
//         await prisma.user.update({
//             where: { id },
//             data: { name, email },
//         });

//         revalidatePath('/perfil');
//         return { success: 'Usuario modificado' };
//     } catch (error) {
//         console.error("Error updating user:", error);
//         return { error: 'Error al modificar el usuario' };
//     }
// }

// export async function editUser(prevState, formData) {
//     const id = formData.get('id');
//     const name = formData.get('name');
//     const email = formData.get('email');
//     const role = formData.get('role');

//     console.log("📥 role recibido:", role); // Verifica esto en la consola

//     if (!id) {
//         return { error: 'ID de usuario no proporcionado' };
//     }

//     try {
//         await prisma.user.update({
//             where: { id },
//             data: {
//                 name,
//                 email,
//                 ...(role && { role }) // solo si role no es null
//             },
//         });

//         revalidatePath('/perfil');
//         return { success: 'Usuario modificado' };
//     } catch (error) {
//         console.error("❌ Error updating user:", error);
//         return { error: `Error al modificar el usuario: ${error.message}` };
//     }
// }

// export async function editUser(prevState, formData) {
//   const id = formData.get('id')
//   const name = formData.get('name')
//   const email = formData.get('email')
//   const phone = formData.get('phone')
//   const role = formData.get('role')
//   const password = formData.get('password')

//   // Validar nombre duplicado
//   if (name) {
//     const existingUserByName = await prisma.user.findFirst({
//       where: {
//         name: name,
//         NOT: { id: id }
//       }
//     });

//     if (existingUserByName) {
//       return { error: 'Este nombre ya está registrado' };
//     }
//   }

//   // Validar teléfono duplicado
//   if (phone) {
//     const existingUserByPhone = await prisma.user.findFirst({
//       where: {
//         phone: phone,
//         NOT: { id: id }
//       }
//     });

//     if (existingUserByPhone) {
//       return { error: 'Este número de teléfono ya está registrado' };
//     }
//   }

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

export async function editUser(prevState, formData) {
  const id = formData.get('id')
  const name = formData.get('name')
  const email = formData.get('email')
  const phone = formData.get('phone')
  const role = formData.get('role')
  const password = formData.get('password')

  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  if (!nameRegex.test(name)) {
    return { error: 'El nombre solo puede contener letras y espacios' };
  }

  // Validar si el nombre ya existe
  const existingUserByName = await prisma.user.findFirst({
    where: {
      name,
      NOT: { id }
    }
  });

  if (existingUserByName) {
    return { error: 'Este nombre ya está registrado' };
  }

  const phoneRegex = /^[0-9]+$/;
  if (!phoneRegex.test(phone)) {
    return { error: 'El teléfono solo puede contener números' };
  }
  // Validar si el teléfono ya existe
  if (phone) {
    const existingUserByPhone = await prisma.user.findFirst({
      where: {
        phone,
        NOT: { id }
      }
    });

    if (existingUserByPhone) {
      return { error: 'Este número de teléfono ya está registrado' };
    }
  }

  // Actualizar
  try {
    await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        password,
        ...(role && { role })
      }
    });

    revalidatePath('/perfil')
    revalidatePath('/users')
    return { success: 'Usuario actualizado correctamente' }
  } catch (error) {
    console.error("Error updating user:", error)
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


// //  ------------------------ REPARTIDORES ------------------------


// export async function insertarRepartidor(prevState, formData) {
//     const nombre = formData.get('nombre')
//     const telefono = formData.get('telefono')

//     await prisma.repartidor.create({
//         data: { nombre, telefono }
//     })

//     revalidatePath('/repartidores')
//     return { success: 'Repartidor guardado' }


// }



// export async function modificarRepartidor(prevState, formData) {
//     const id = Number(formData.get('id'))
//     const nombre = formData.get('nombre')
//     const telefono = formData.get('telefono')


//     await prisma.repartidor.update({
//         where: { id },
//         data: { nombre, telefono }
//     })

//     revalidatePath('/repartidores')
//     return { success: 'Repartidor modificado' }

// }



// export async function eliminarRepartidor(prevState, formData) {
//     const id = Number(formData.get('id'))

//     await prisma.repartidor.delete({
//         where: {
//             id: id
//         }
//     })

//     revalidatePath('/repartidores')
//     return { success: 'Repartidor eliminado' }


// }


// //  ------------------------ PEDIDOS ------------------------


// export async function insertarPedido(prevState, formData) {
//     const fecha_hora = new Date(formData.get('fecha_hora'))
//     const nombre_cliente = formData.get('nombre_cliente')
//     const direccion_cliente = formData.get('direccion_cliente')

//     const repartidorId = Number(formData.get('repartidorId')) || null

//     const pizzasIDs = await prisma.pizza.findMany({
//         select: { id: true }
//     })
//     // console.log(pizzasIDs);
//     const connect = pizzasIDs.filter(p => formData.get(`pizza${p.id}`) !== null)
//     // console.log(connect);

//     await prisma.pedido.create({
//         data: {
//             fecha_hora: fecha_hora,
//             nombre_cliente: nombre_cliente,
//             direccion_cliente: direccion_cliente,
//             repartidorId: repartidorId,
//             pizzas: { connect }
//         }
//     })

//     revalidatePath('/pedidos')
//     return { success: 'Operación realizada correctamente' }

// }



// export async function modificarPedido(prevState, formData) {
//     const id = Number(formData.get('id'))
//     const fecha_hora = new Date(formData.get('fecha_hora'))
//     const nombre_cliente = formData.get('nombre_cliente')
//     const direccion_cliente = formData.get('direccion_cliente')

//     const repartidorId = Number(formData.get('repartidorId')) || null

//     const pizzasIDs = await prisma.pizza.findMany({
//         select: { id: true }
//     })
//     // console.log(pizzasIDs);
//     const connect = pizzasIDs.filter(p => formData.get(`pizza${p.id}`) !== null)
//     const disconnect = pizzasIDs.filter(p => formData.get(`pizza${p.id}`) === null)
//     // console.log(connect);

//     await prisma.pedido.update({
//         where: { id },
//         data: {
//             fecha_hora: fecha_hora,
//             nombre_cliente: nombre_cliente,
//             direccion_cliente: direccion_cliente,
//             repartidorId: repartidorId,
//             pizzas: { connect, disconnect }
//         }
//     })

//     revalidatePath('/pedidos')
//     return { success: 'Operación realizada correctamente' }
// }



// export async function eliminarPedido(prevState, formData) {
//     const id = Number(formData.get('id'))

//     await prisma.pedido.delete({
//         where: {
//             id: id
//         }
//     })

//     revalidatePath('/pedidos')
//     return { success: 'Operación realizada correctamente' }

// }

// // ------------------------------- PIZZAS -----------------------


// export async function insertarPizza(prevState, formData) {
//     const nombre = formData.get('nombre')
//     const precio = Number(formData.get('precio'))
//     const file = formData.get('file')

//     // si tenemos nuevo archivo en el input type=file
//     if (file.size > 0) {
//         const foto = await uploadImage(file)
//         await prisma.pizza.create({
//             data: { nombre, precio, foto }
//         })
//     } else {
//         await prisma.pizza.create({
//             data: { nombre, precio }
//         })
//     }


//     revalidatePath('/pizzas')
//     return { success: 'Pizza creada' }

// }



// export async function modificarPizza(prevState, formData) {
//     const id = Number(formData.get('id'))
//     const nombre = formData.get('nombre')
//     const precio = Number(formData.get('precio'))
//     const file = formData.get('file')

//     // si tenemos nuevo archivo en el input type=file
//     if (file.size > 0) {
//         const foto = await uploadImage(file)
//         await prisma.pizza.update({
//             where: { id },
//             data: { nombre, precio, foto }
//         })
//     } else {
//         await prisma.pizza.update({
//             where: { id },
//             data: { nombre, precio }
//         })
//     }

//     revalidatePath('/pizzas')
//     return { success: 'Pizza modificada' }
// }



// export async function eliminarPizza(prevState, formData) {
//     const id = Number(formData.get('id'))

//     await prisma.pizza.delete({
//         where: { id }
//     })

//     revalidatePath('/pizzas')
//     return { success: 'Pizza eliminada' }

// }


