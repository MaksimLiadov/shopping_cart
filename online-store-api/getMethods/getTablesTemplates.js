import sequelize from '../config/dbConnect.js';

// Функция для замены ключей на русские
function translateTableNames(tables) {
  const tableNameMapping = {
    goods: 'Товары',
    furniture: 'Мебель'
  };

  const translatedTables = {};

  for (const table in tables) {
    if (tables.hasOwnProperty(table)) {
      const translatedName = tableNameMapping[table] || table;
      translatedTables[translatedName] = tables[table];
    }
  }

  return translatedTables;
}

/**
 * Метод для получения объекта с таблицами-шаблонами и их столбцами, кроме id.
 * @param {Array<string>} tableNames - Массив с именами таблиц, которые нужно получить.
 * @returns {Promise<object>} Объект с названиями таблиц и массивами их столбцов.
 */
export async function getTablesTemplates(tableNames) {
  const queryInterface = sequelize.getQueryInterface();
  const tablesTemplates = {};

  try {
    for (const tableName of tableNames) {
      const columns = await queryInterface.describeTable(tableName); // Описание таблицы

      const filteredColumns = Object.keys(columns).filter(column => column !== 'id');
      tablesTemplates[tableName] = filteredColumns; // Список названий столбцов без id
    }

    const translatedTablesTemplates = translateTableNames(tablesTemplates); // Заменяем названия таблиц на русские
    return translatedTablesTemplates;
  } catch (error) {
    console.error('Ошибка получения объекта с таблицами-шаблонами:', error);
    throw error;
  }
}