import sequelize from '../config/dbConnect.js';

/**
 * Метод для получения массива столбцов из таблицы order_processing.
 * @returns {Promise<Array<object>>} Массив объектов формата { name: string, required: boolean }
 */
export async function getOrderProcessingColumns() {
  const queryInterface = sequelize.getQueryInterface();

  try {
    // Получаем информацию о структуре таблицы order_processing
    const columns = await queryInterface.describeTable('order_processing');

    // Формируем массив объектов
    const orderProcessingColumns = Object.entries(columns).map(([columnName, columnInfo]) => ({
      name: columnName, // Название столбца из ключа объекта
      required: columnInfo.allowNull === false || columnInfo.primaryKey === true, // PRIMARY KEY всегда обязательный
    }));

    return orderProcessingColumns;
  } catch (error) {
    console.error('Ошибка получения данных из order_processing:', error);
    throw error;
  }
}