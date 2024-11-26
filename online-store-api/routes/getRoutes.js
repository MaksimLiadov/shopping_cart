import express from 'express';
import { getTablesTemplates } from '../getMethods/getTablesTemplates.js';

const router = express.Router();

/**
 * Роут для получения структуры только таблиц-шаблонов.
 */
router.get('/tablesTemplates', async (req, res) => {
    const specificTables = ['goods', 'furniture']; // Список таблиц-шаблонов
  
    try {
      const tablesTemplates = await getTablesTemplates(specificTables);
      res.json(tablesTemplates);
    } catch (error) {
      console.error('Error in /api/tablesTemplates route:', error);
      res.status(500).json({ error: 'Failed to fetch tables data' });
    }
  });

export default router;