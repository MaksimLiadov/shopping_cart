import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConnect.js';

// Функция для перевода названия таблицы с русского на английский
function translateTemplateName(russianName) {
    const tableNameMapping = {
        'Товары': 'goods',
        'Мебель': 'furniture',
    };
    
    return tableNameMapping[russianName];
}


export const uploadUserData = async (req, res) => {
    const { userId, userTableName, templateName, columns, data } = req.body;

    const transaction = await sequelize.transaction();

    try {
        if (!userId || !userTableName || !templateName || !Array.isArray(columns) || !Array.isArray(data)) {
            return res.status(400).json({ error: 'Некорректные входные данные.' });
        }

        // Переводим название шаблонной таблицы с русского на английский
        const translatedTemplateName = translateTemplateName(templateName);
        if (!translatedTemplateName) {
            return res.status(400).json({ error: `Шаблонная таблица "${templateName}" не найдена.` });
        }

        // Уникальное имя таблицы
        const uniqueTableName = `user_${userId}_${userTableName}`;

        // Проверяем уникальность имени таблицы для данного пользователя
        const [existingTable] = await sequelize.query(
            'SELECT id FROM user_tables WHERE user_id = ? AND table_name = ?',
            {
                replacements: [userId, uniqueTableName],
                type: sequelize.QueryTypes.SELECT,
            }
        );
    
        if (existingTable) {
            return res.status(400).json({ error: `Таблица с именем "${userTableName}" уже существует для данного пользователя.` });
        }

        // Получаем информацию о структуре шаблонной таблицы
        const [columnsInfo] = await sequelize.query(`PRAGMA table_info(${translatedTemplateName});`);
        if (!columnsInfo || columnsInfo.length === 0) {
            console.error(`Шаблонная таблица ${translatedTemplateName} не найдена.`);
            throw new Error(`Шаблонная таблица ${translatedTemplateName} не найдена.`);
        }

        // Генерация SQL для создания таблицы с точной структурой
        const createTableSQL = `
          CREATE TABLE ${uniqueTableName} (
            ${columnsInfo
              .map(col => `${col.name} ${col.type}${col.pk ? ' PRIMARY KEY' : ''}${col.notnull ? ' NOT NULL' : ''}`)
              .join(', ')}
          );
        `;

        await sequelize.query(createTableSQL, { transaction });

        // Вставка данных в таблицу
        for (const row of data) {
            const rowData = {};
            columns.forEach((column, index) => {
                const value = row[index];
                if (column === 'price') {
                    if (typeof value !== 'number' || isNaN(value)) {
                        console.error('Ошибка: значения в поле "price" должны быть числовыми.');
                        throw new Error(`Ошибка в данных: значения в поле "price" должны быть числовыми. Было получено: ${value}`);
                    }
                }
                rowData[column] = value;
            });
    
            await sequelize.queryInterface.bulkInsert(uniqueTableName, [rowData], { transaction });
        }

        // Записываем информацию о таблице в user_tables
        await sequelize.query(
            'INSERT INTO user_tables (user_id, table_name) VALUES (?, ?)',
            {
                replacements: [userId, uniqueTableName],
                type: sequelize.QueryTypes.INSERT,
                transaction,
            }
        );

        // Подтверждаем транзакцию, если всё прошло успешно
        await transaction.commit();
        res.status(201).json({ message: 'Таблица успешно создана и данные добавлены.', tableName: uniqueTableName });
    } catch (error) {
        // Откатываем транзакцию в случае ошибки
        await transaction.rollback();

        console.error('Ошибка при загрузке данных пользователя:', error);
        res.status(500).json({ error: 'Ошибка при обработке данных.' });
    }
};

// Преобразование русских символов и пробелов в имена столбцов
function processColumnName(name) {
    const cyrillicToLatinMap = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
        'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
        'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
        'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
        'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
        'э': 'e', 'ю': 'yu', 'я': 'ya'
    };

    // Заменяем пробелы на подчеркивания
    const sanitized = name.replace(/\s+/g, '_').toLowerCase();

    return sanitized.split('').map(char => cyrillicToLatinMap[char] || char).join('');
}


export const createOrderTables = async (req, res) => {
    const { userId, primaryTableName, secondaryTableName, secondaryColumns } = req.body;

    const transaction = await sequelize.transaction();

    const primaryTableFullName = `user_${userId}_${primaryTableName}`;
    const secondaryTableFullName = `user_${userId}_${secondaryTableName}`;

    try {
        if (!userId || !primaryTableName || !secondaryTableName || !Array.isArray(secondaryColumns)) {
            console.error('Ошибка: Некорректные входные данные.');
            throw new Error('Некорректные входные данные.');
        }

        // Обрабатываем имена столбцов
        const processedColumns = secondaryColumns.map(column => ({
            ...column,
            name: processColumnName(column.name),
        }));

        // Проверяем связь таблиц в related_tables
        const [existingRelation] = await sequelize.query(
            'SELECT id FROM related_tables WHERE secondary_table = ?',
            {
                replacements: [secondaryTableFullName],
                type: sequelize.QueryTypes.SELECT,
            }
        );
    
        if (existingRelation) {
            console.error(`Ошибка: Таблица "${secondaryTableName}" уже связана с другой таблицей:`);
            throw new Error(`Таблица "${secondaryTableName}" уже связана с другой таблицей.`);
        }

        // Создание второй таблицы
        const secondaryTableDefinition = processedColumns.reduce((definition, column) => {
            if (!column.name) {
                console.error('Ошибка: пустое имя столбца:', column);
                throw new Error('Имя столбца не может быть пустым.');
            }
            if (typeof column.required !== 'boolean') {
                console.error('Ошибка: некорректное значение required:', column);
                throw new Error('Поле "required" должно быть true или false.');
            }
            definition[column.name] = { type: DataTypes.STRING, allowNull: !column.required };
            return definition;
        }, {});

        await sequelize.getQueryInterface().createTable(secondaryTableFullName, {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            ...secondaryTableDefinition,
        }, { transaction });

        // Сохраняем связь между таблицами
        await sequelize.query(
            'INSERT INTO related_tables (user_id, primary_table, secondary_table) VALUES (?, ?, ?)',
            {
                replacements: [userId, primaryTableFullName, secondaryTableFullName],
                type: sequelize.QueryTypes.INSERT,
                transaction,
            }
        );

        // Подтверждаем транзакцию
        await transaction.commit();
        res.status(201).json({
            message: 'Таблицы успешно созданы и связаны.',
            primaryTable: primaryTableFullName,
            secondaryTable: secondaryTableFullName,
        });
    } catch (error) {
        // Откатываем транзакцию и удаляем первую таблицу, если вторая не создана
        await transaction.rollback();

        console.error('Ошибка при создании таблиц:', error.message);

        await sequelize.getQueryInterface().dropTable(primaryTableFullName);
        await sequelize.query(
            'DELETE FROM user_tables WHERE user_id = ? AND table_name = ?',
            {
                replacements: [userId, primaryTableFullName],
                type: sequelize.QueryTypes.DELETE,
            }
        );

        res.status(500).json({ error: 'Ошибка при обработке данных.' });
    }
};