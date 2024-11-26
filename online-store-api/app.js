import express from 'express';
import cors from 'cors';
import { checkDbConnection } from './config/dbConnect.js'; // Импортируем функцию для проверки подключения к базе данных
import getRoutes from './routes/getRoutes.js';

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

app.use('/api/get', getRoutes);

// Проверка подключения к базе данных
checkDbConnection()
  .then(() => {
    // Запуск сервера при успешном подключении
    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Ошибка запуска сервера из-за проблемы с подключением к базе данных:', error);
    process.exit(1); // Завершаем процесс, если не удалось подключиться к БД
  });