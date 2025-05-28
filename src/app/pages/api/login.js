// pages/api/login.js
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { getUserByPhone } from '@/lib/data'; 

// export default async function handler(req, res) {
//     if (req.method !== 'POST') {
//         return res.status(405).json({ message: 'Method not allowed' });
//     }

//     const { phone, password } = req.body;

//     try {
//         // Obtener el usuario por teléfono
//         const user = await getUserByPhone(phone);

//         if (!user) {
//             return res.status(401).json({ error: 'Usuario no registrado.' });
//         }

//         // Comparar la contraseña
//         const matchPassword = await bcrypt.compare(password, user.password);

//         if (!matchPassword) {
//             return res.status(401).json({ error: 'Credenciales incorrectas.' });
//         }

//         // Generar un token JWT
//         const token = jwt.sign({ userId: user.id }, 'yourSecretKey', { expiresIn: '1h' });

//         res.status(200).json({ success: true, token });
//     } catch (error) {
//         console.error('Error al iniciar sesión:', error);
//         res.status(500).json({ error: 'Error al iniciar sesión' });
//     }
// }

import bcrypt from 'bcryptjs';
import { getUserByPhone } from '@/lib/data';

CredentialsProvider({
  name: 'Credentials',
  credentials: {
    phone: { label: "Teléfono", type: "text" },
    password: { label: "Contraseña", type: "password" }
  },
  async authorize(credentials) {
    const { phone, password } = credentials;

    if (!/^\d{9}$/.test(phone)) {
      throw new Error('InvalidPhoneFormat');
    }

    const user = await getUserByPhone(phone);

    if (!user) {
      console.error('Usuario no encontrado');
      throw new Error('CredentialsSignin');
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      console.error('Contraseña incorrecta');
      throw new Error('CredentialsSignin');
    }

    // Devuelve un objeto usuario que se serializa en el token
    return {
      id: user.id,
      phone: user.phone,
      name: user.name // o cualquier otro campo necesario
    };
  }
})
