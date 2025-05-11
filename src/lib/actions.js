'use server'
import cloudinary from "@/lib/cloudinary"
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { signIn, signOut } from '@/auth'
import { getUserByEmail, getUserByPhone } from '@/lib/data'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { PaintBucket } from "lucide-react"



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
export async function login(prevState, formData) {
    const phone = formData.get('phone')
    const password = formData.get('password')

    // Comprobamos si el usuario está registrado
    const user = await getUserByPhone(phone);

    if (!user) {
        return { error: 'Usuario no registrado.' }
    }
    // Comparamos password 
    let matchPassword = false

    if (user.password == null)  // Si no hay contraseña almacenada en BD
        matchPassword = true
    else
        matchPassword = await bcrypt.compare(password, user.password)

    if (user && matchPassword)  // && user.emailVerified
    {
        await signIn('credentials',
            {
                phone, password,
                redirectTo: globalThis.callbackUrl
            })
        return { success: "Inicio de sesión correcto" }
    } else {
        return { error: 'Credenciales incorrectas.' }
    }

}


// Preguta pa Pani

// export async function login(prevState, formData) {
//     const phone = formData.get('phone');
//     const password = formData.get('password');

//     // Comprobamos si el usuario está registrado
//     const user = await getUserByPhone(phone);

//     if (!user) {
//         return { error: 'Usuario no registrado.' };
//     }

//     // Comparamos password
//     let matchPassword = false;

//     if (user.password == null) { // Si no hay contraseña almacenada en BD
//         matchPassword = true;
//     } else {
//         matchPassword = await bcrypt.compare(password, user.password);
//     }

//     if (user && matchPassword) {
//         // Generar token de sesión o cookie aquí
//         const token = generateSessionToken(user); // Implementa esta función según tu lógica de autenticación

//         // Configurar cookie de sesión
//         document.cookie = `sessionToken=${token}; max-age=${24 * 60 * 60}; path=/; Secure; HttpOnly`;

//         await signIn('credentials', {
//             phone, password,
//             redirectTo: globalThis.callbackUrl
//         });

//         return { success: "Inicio de sesión correcto" };
//     } else {
//         return { error: 'Credenciales incorrectas.' };
//     }
// }




// LOGIN credentials
// export async function login(formData) {
//     const phone = formData.phone
//     // const password = formData.get('password');
  
//     if (!phone) {
//       return { error: "Debes ingresar tu número de teléfono." };
//     }
  
//     const user = await getUserByPhone(phone);
  
//     if (!user) {
//       return { error: "Usuario no encontrado." };
//     }
//     // validar contraseña, etc.
//   }
  

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


export async function editUser(prevState, formData) {
    const id = formData.get('id');
    const name = formData.get('name');
    const email = formData.get('email');

    console.log("Updating user with ID:", id, "Name:", name, "Email:", email);

    try {
        await prisma.user.update({
            where: { id },
            data: { name, email },
        });

        revalidatePath('/dashboard');
        return { success: 'Usuario modificado' };
    } catch (error) {
        console.error("Error updating user:", error);
        return { error: 'Error al modificar el usuario' };
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




//  ------------------------ REPARTIDORES ------------------------


export async function insertarRepartidor(prevState, formData) {
    const nombre = formData.get('nombre')
    const telefono = formData.get('telefono')

    await prisma.repartidor.create({
        data: { nombre, telefono }
    })

    revalidatePath('/repartidores')
    return { success: 'Repartidor guardado' }


}



export async function modificarRepartidor(prevState, formData) {
    const id = Number(formData.get('id'))
    const nombre = formData.get('nombre')
    const telefono = formData.get('telefono')


    await prisma.repartidor.update({
        where: { id },
        data: { nombre, telefono }
    })

    revalidatePath('/repartidores')
    return { success: 'Repartidor modificado' }

}



export async function eliminarRepartidor(prevState, formData) {
    const id = Number(formData.get('id'))

    await prisma.repartidor.delete({
        where: {
            id: id
        }
    })

    revalidatePath('/repartidores')
    return { success: 'Repartidor eliminado' }


}


//  ------------------------ PEDIDOS ------------------------


export async function insertarPedido(prevState, formData) {
    const fecha_hora = new Date(formData.get('fecha_hora'))
    const nombre_cliente = formData.get('nombre_cliente')
    const direccion_cliente = formData.get('direccion_cliente')

    const repartidorId = Number(formData.get('repartidorId')) || null

    const pizzasIDs = await prisma.pizza.findMany({
        select: { id: true }
    })
    // console.log(pizzasIDs);
    const connect = pizzasIDs.filter(p => formData.get(`pizza${p.id}`) !== null)
    // console.log(connect);

    await prisma.pedido.create({
        data: {
            fecha_hora: fecha_hora,
            nombre_cliente: nombre_cliente,
            direccion_cliente: direccion_cliente,
            repartidorId: repartidorId,
            pizzas: { connect }
        }
    })

    revalidatePath('/pedidos')
    return { success: 'Operación realizada correctamente' }

}



export async function modificarPedido(prevState, formData) {
    const id = Number(formData.get('id'))
    const fecha_hora = new Date(formData.get('fecha_hora'))
    const nombre_cliente = formData.get('nombre_cliente')
    const direccion_cliente = formData.get('direccion_cliente')

    const repartidorId = Number(formData.get('repartidorId')) || null

    const pizzasIDs = await prisma.pizza.findMany({
        select: { id: true }
    })
    // console.log(pizzasIDs);
    const connect = pizzasIDs.filter(p => formData.get(`pizza${p.id}`) !== null)
    const disconnect = pizzasIDs.filter(p => formData.get(`pizza${p.id}`) === null)
    // console.log(connect);

    await prisma.pedido.update({
        where: { id },
        data: {
            fecha_hora: fecha_hora,
            nombre_cliente: nombre_cliente,
            direccion_cliente: direccion_cliente,
            repartidorId: repartidorId,
            pizzas: { connect, disconnect }
        }
    })

    revalidatePath('/pedidos')
    return { success: 'Operación realizada correctamente' }
}



export async function eliminarPedido(prevState, formData) {
    const id = Number(formData.get('id'))

    await prisma.pedido.delete({
        where: {
            id: id
        }
    })

    revalidatePath('/pedidos')
    return { success: 'Operación realizada correctamente' }

}

// ------------------------------- PIZZAS -----------------------


export async function insertarPizza(prevState, formData) {
    const nombre = formData.get('nombre')
    const precio = Number(formData.get('precio'))
    const file = formData.get('file')

    // si tenemos nuevo archivo en el input type=file
    if (file.size > 0) {
        const foto = await uploadImage(file)
        await prisma.pizza.create({
            data: { nombre, precio, foto }
        })
    } else {
        await prisma.pizza.create({
            data: { nombre, precio }
        })
    }


    revalidatePath('/pizzas')
    return { success: 'Pizza creada' }

}



export async function modificarPizza(prevState, formData) {
    const id = Number(formData.get('id'))
    const nombre = formData.get('nombre')
    const precio = Number(formData.get('precio'))
    const file = formData.get('file')

    // si tenemos nuevo archivo en el input type=file
    if (file.size > 0) {
        const foto = await uploadImage(file)
        await prisma.pizza.update({
            where: { id },
            data: { nombre, precio, foto }
        })
    } else {
        await prisma.pizza.update({
            where: { id },
            data: { nombre, precio }
        })
    }

    revalidatePath('/pizzas')
    return { success: 'Pizza modificada' }
}



export async function eliminarPizza(prevState, formData) {
    const id = Number(formData.get('id'))

    await prisma.pizza.delete({
        where: { id }
    })

    revalidatePath('/pizzas')
    return { success: 'Pizza eliminada' }

}


