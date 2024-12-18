import sequelize from '../config/dbConnect.js';
import bcrypt from 'bcrypt';

/**
 * Метод для регистрации нового пользователя.
 */
export const registerUser = async (req, res) => {
    const { username, password, name } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ error: 'Имя пользователя и пароль обязательны' });
        }

        // Проверка на уникальность username
        const [existingUser] = await sequelize.query(
            'SELECT id FROM users WHERE username = ?',
            { replacements: [username], type: sequelize.QueryTypes.SELECT }
        );

        if (existingUser) {
            return res.status(409).json({ error: 'Имя пользователя уже занято' });
        }

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Вставка нового пользователя с именем и фамилией
        await sequelize.query(
            `INSERT INTO users (username, password, role, name, created_at) 
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            { replacements: [username, hashedPassword, 'user', name || null] }
        );

        const [user] = await sequelize.query(
            'SELECT id, password, role FROM users WHERE username = ?',
            { replacements: [username], type: sequelize.QueryTypes.SELECT }
        );

        res.status(201).json({
            message: 'Пользователь успешно зарегистрирован',
            user: { id: user.id, username, role: user.role },
        });
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

/**
 * Метод для авторизации пользователя.
 */
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ error: 'Имя пользователя и пароль обязательны' });
        }

        // Поиск пользователя по username
        const [user] = await sequelize.query(
            'SELECT id, password, role FROM users WHERE username = ?',
            { replacements: [username], type: sequelize.QueryTypes.SELECT }
        );

        if (!user) {
            return res.status(401).json({ error: 'Неверные имя пользователя или пароль' });
        }

        // Проверка пароля
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Неверные имя пользователя или пароль' });
        }

        res.status(200).json({
            message: 'Авторизация успешна',
            user: { id: user.id, username, role: user.role },
        });
    } catch (error) {
        console.error('Ошибка при авторизации:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};