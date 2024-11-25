import express from 'express';
import sequelize from '../config/database.js'; // Ваш экземпляр Sequelize

const router = express.Router();

/**
 * @swagger
 * /api/database/structure:
 *   get:
 *     summary: Получить структуру базы данных
 *     tags: [Database]
 *     responses:
 *       200:
 *         description: Успешно получена структура базы данных
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Название столбца
 *       500:
 *         description: Ошибка сервера
 */

router.get('/structure', async (req, res) => {
  try {
    const tables = {};
    const queryInterface = sequelize.getQueryInterface();

    // Получаем список шаблонных таблиц
    const selectedTableNames = ['goods', 'furniture'];

    for (const tableName of selectedTableNames) {
      // Получаем описание столбцов для каждой таблицы
      const tableDescription = await queryInterface.describeTable(tableName);
      tables[tableName] = Object.keys(tableDescription);
    }

    res.json(tables);
  } catch (error) {
    console.error('Ошибка получения структуры базы данных:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;