import express from 'express';
import sequelize from './config/database.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './docs/swagger.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// Подключение маршрутов
import databaseRoutes from './routes/databaseRoutes.js';
app.use('/api/database', databaseRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Подключение к базе данных успешно.');
    console.log(`Сервер запущен на порту ${PORT}`);
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
  }
});