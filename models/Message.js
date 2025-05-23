const db = require("../config/database");

class Message {
  // Получить все сообщения
  static async getAll() {
    try {
      const result = await db.query(`
        SELECT m.*, u.username 
        FROM messages m 
        LEFT JOIN users u ON m.user_id = u.id 
        ORDER BY m.created_at DESC
      `);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  // Получить сообщение по ID
  static async getById(id) {
    try {
      const result = await db.query(
        `
        SELECT m.*, u.username, u.email 
        FROM messages m 
        LEFT JOIN users u ON m.user_id = u.id 
        WHERE m.id = $1
      `,
        [id]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  // Получить сообщения конкретного пользователя
  static async getByUserId(userId) {
    try {
      const result = await db.query(
        "SELECT * FROM messages WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
      );
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  // Получить сообщения по статусу
  static async getByStatus(status) {
    try {
      const result = await db.query(
        `
        SELECT m.*, u.username 
        FROM messages m 
        LEFT JOIN users u ON m.user_id = u.id 
        WHERE m.status = $1 
        ORDER BY m.created_at DESC
      `,
        [status]
      );
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  // Создать новое сообщение
  static async create(messageData) {
    try {
      const { user_id, subject, message } = messageData;
      const result = await db.query(
        "INSERT INTO messages (user_id, subject, message) VALUES ($1, $2, $3) RETURNING id",
        [user_id, subject, message]
      );
      return result.rows[0].id;
    } catch (err) {
      throw err;
    }
  }

  // Обновить статус сообщения
  static async updateStatus(id, status) {
    try {
      const result = await db.query(
        "UPDATE messages SET status = $1 WHERE id = $2",
        [status, id]
      );
      return result.rowCount > 0;
    } catch (err) {
      throw err;
    }
  }

  // Удалить сообщение
  static async delete(id) {
    try {
      const result = await db.query("DELETE FROM messages WHERE id = $1", [id]);
      return result.rowCount > 0;
    } catch (err) {
      throw err;
    }
  }

  // Получить количество новых сообщений
  static async getNewCount() {
    try {
      const result = await db.query(
        "SELECT COUNT(*) as count FROM messages WHERE status = 'new'"
      );
      return parseInt(result.rows[0].count);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Message;
