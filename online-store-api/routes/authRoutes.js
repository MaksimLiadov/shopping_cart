import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

/**
 * Роут для регистрации пользователя.
 */
router.post('/register', async (req, res) => {
    try {
        await registerUser(req, res);
    } catch (error) {
        console.error('Ошибка в /api/auth/register:', error);
        res.status(500).json({ error: 'Ошибка сервера при регистрации' });
    }
});

/**
 * Роут для авторизации пользователя.
 */
router.post('/login', async (req, res) => {
    try {
        await loginUser(req, res);
    } catch (error) {
        console.error('Ошибка в /api/auth/login:', error);
        res.status(500).json({ error: 'Ошибка сервера при авторизации' });
    }
});

export default router;