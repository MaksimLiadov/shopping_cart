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

      // Формируем массив объектов, исключая столбец "id"
      const orderProcessingColumns = Object.entries(columns)
      .filter(([columnName]) => columnName !== 'id')
      .map(([columnName, columnInfo]) => ({
        name: columnName,
        required: columnInfo.allowNull === false,
        }));

      return orderProcessingColumns;
    } catch (error) {
      console.error('Ошибка получения данных из order_processing:', error);
      throw error;
    }
}