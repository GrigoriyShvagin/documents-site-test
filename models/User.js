const db = require("../config/database");

class User {
  // Получить всех пользователей
  static async getAll() {
    try {
      const result = await db.query(
        "SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC"
      );
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  // Получить пользователя по ID
  static async getById(id) {
    try {
      const result = await db.query(
        "SELECT id, username, email, role, created_at FROM users WHERE id = $1",
        [id]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  // Получить пользователя по username
  static async getByUsername(username) {
    try {
      const result = await db.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  // Получить пользователя по email
  static async getByEmail(email) {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  // Создать нового пользователя
  static async create(userData) {
    try {
      const { username, email, password, role = "user" } = userData;
      const result = await db.query(
        "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
        [username, email, password, role]
      );
      return result.rows[0].id;
    } catch (err) {
      throw err;
    }
  }

  // Обновить пользователя
  static async update(id, userData) {
    try {
      const { username, email, role } = userData;
      const result = await db.query(
        "UPDATE users SET username = $1, email = $2, role = $3 WHERE id = $4",
        [username, email, role, id]
      );
      return result.rowCount > 0;
    } catch (err) {
      throw err;
    }
  }

  // Удалить пользователя
  static async delete(id) {
    try {
      const result = await db.query("DELETE FROM users WHERE id = $1", [id]);
      return result.rowCount > 0;
    } catch (err) {
      throw err;
    }
  }

  // Проверить пароль (простая проверка без хеширования)
  static async authenticate(username, password) {
    try {
      const result = await db.query(
        "SELECT * FROM users WHERE username = $1 AND password = $2",
        [username, password]
      );
      if (result.rows.length > 0) {
        const user = result.rows[0];
        // Не возвращаем пароль
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      return null;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = User;
