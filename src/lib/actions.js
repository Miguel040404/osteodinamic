'use server'
import cloudinary from "@/lib/cloudinary"
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from "@/auth"; 
import { getUserByPhone } from "./data"


// ------------------------ RESERVAS --------------------------------

export async function getReservasDelUsuario(userId) {
  return await prisma.reserva.findMany({
    where: { userId },
    include: {
      horario: true, // Para incluir la hora y el día
    },
    orderBy: {
      horario: { dia: "asc" },
    },
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

// ------------------------  cancelarReserva --------------------------------

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

// ------------------------  AUTH --------------------------------

// REGISTER
export async function register(prevState, formData) {
    const name = formData.get('name')
    const phone = formData.get('phone')
    const password = formData.get('password')

    // Comprobamos si el usuario ya está registrado
    const user = await getUserByPhone(phone);

    if (user) {
        return { error: 'El email ya está registrado' }
    }

    // Encriptamos password 
    const hashedPassword = await bcrypt.hash(password, 10)

    // Guardamos credenciales en base datos
    await prisma.user.create({
        data: {
            name,
            phone,
            password: hashedPassword
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

export async function editUser(prevState, formData) {
  const id = formData.get('id')
  const name = formData.get('name')
  const email = formData.get('email')
  const phone = formData.get('phone')
  const role = formData.get('role')

  if (phone) {
    const existingUser = await prisma.user.findFirst({
      where: {
        phone: phone,
        NOT: { id: id }
      }
    });
    
    if (existingUser) {
      return { error: 'Este número de teléfono ya está registrado' };
    }
  }

   try {
    await prisma.user.update({
      where: { id },
      data: {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: phone,
        ...(formData.get('role') && { role: formData.get('role') })
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


