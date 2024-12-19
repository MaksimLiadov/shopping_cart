import express from 'express';
import { uploadUserData } from '../controllers/userController.js';
import { createOrderTables } from '../controllers/userController.js';

const router = express.Router();

/**
 * Роут для загрузки данных из таблицы пользователя.
 */
router.post('/uploadData', async (req, res) => {
    try {
        await uploadUserData(req, res);
    } catch (error) {
        console.error('Ошибка в /api/user/uploadData:', error);
        res.status(500).json({ error: 'Ошибка сервера при сохранении данных' });
    }
});

/**
 * Роут для сохранения таблицы оформления заказа, созданной пользователем.
 */
router.post('/createOrderTables', async (req, res) => {
    try {
        await createOrderTables(req, res);
    } catch (error) {
        console.error('Ошибка в /api/user/createOrderTables:', error);
        res.status(500).json({ error: 'Ошибка сервера при сохранении данных' });
    }
});

export default router;