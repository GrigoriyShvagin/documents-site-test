-- Создание базы данных
CREATE DATABASE document_library;


-- Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'support')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица документов
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    file_path VARCHAR(500),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица сообщений в поддержку
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Тестовые данные
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@example.com', 'admin123', 'admin'),
('support', 'support@example.com', 'support123', 'support'),
('user1', 'user1@example.com', 'user123', 'user'),
('user2', 'user2@example.com', 'user123', 'user');

INSERT INTO documents (title, description, user_id) VALUES 
('Руководство пользователя', 'Инструкция по работе с системой', 3),
('Отчет за месяц', 'Ежемесячный отчет', 3),
('Презентация проекта', 'Презентация для клиентов', 4),
('Политика конфиденциальности', 'Информация о том, как мы обрабатываем данные', 1);

INSERT INTO messages (user_id, subject, message) VALUES 
(3, 'Проблема с загрузкой', 'Не могу загрузить документ в систему'),
(4, 'Вопрос по функционалу', 'Как удалить старый документ?'); 