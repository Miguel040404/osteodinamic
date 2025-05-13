// pages/api/login.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByPhone } from '@/lib/data'; 

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { phone, password } = req.body;

    try {
        // Obtener el usuario por teléfono
        const user = await getUserByPhone(phone);

        if (!user) {
            return res.status(401).json({ error: 'Usuario no registrado.' });
        }

        // Comparar la contraseña
        const matchPassword = await bcrypt.compare(password, user.password);

        if (!matchPassword) {
            return res.status(401).json({ error: 'Credenciales incorrectas.' });
        }

        // Generar un token JWT
        const token = jwt.sign({ userId: user.id }, 'yourSecretKey', { expiresIn: '1h' });

        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
}
