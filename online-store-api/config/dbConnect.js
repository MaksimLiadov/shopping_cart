import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'online_store.sqlite',
  logging: false,
  define: {
    timestamps: false
  }
});

/**
 * Метод для проверки подключения к базе данных.
 * @returns {Promise<void>} Промис, который будет выполнен при успешном подключении, или выбросит ошибку.
 */
export async function checkDbConnection() {
  try {
    await sequelize.authenticate(); // Попытка установить соединение с БД
    console.log('Подключение к базе данных успешно.');
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
    throw new Error('Ошибка подключения к базе данных.');
  }
}

export default sequelize;