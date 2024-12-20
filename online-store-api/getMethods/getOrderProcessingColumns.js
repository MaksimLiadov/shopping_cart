import sequelize from '../config/dbConnect.js';

/**
 * Метод для получения массива столбцов из таблицы order_processing.
 * @returns {Promise<Array<object>>} Массив объектов формата { name: string, required: boolean }
 */
export async function getOrderProcessingColumns() {
  const queryInterface = sequelize.getQueryInterface();

    // Статичный перевод названий столбцов
    const columnTranslations = {
      recipient_name: 'Имя получателя',
      recipient_phone: 'Телефон получателя',
      delivery_address: 'Адрес доставки',
      payment_method: 'Способ оплаты',
      delivery_date: 'Дата доставки',
    };

    try {
      // Получаем информацию о структуре таблицы order_processing
      const columns = await queryInterface.describeTable('order_processing');

      // Формируем массив объектов, исключая столбец "id"
      const orderProcessingColumns = Object.entries(columns)
      .filter(([columnName]) => columnName !== 'id')
      .map(([columnName, columnInfo]) => ({
        name: columnTranslations[columnName],
        required: columnInfo.allowNull === false,
        }));

      return orderProcessingColumns;
    } catch (error) {
      console.error('Ошибка получения данных из order_processing:', error);
      throw error;
    }
}