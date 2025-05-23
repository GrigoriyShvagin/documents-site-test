const db = require("../config/database");

class Document {
  // Получить все документы
  static async getAll() {
    try {
      const result = await db.query(
        "SELECT d.*, u.username FROM documents d LEFT JOIN users u ON d.user_id = u.id ORDER BY d.created_at DESC"
      );
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  // Получить документ по ID
  static async getById(id) {
    try {
      const result = await db.query(
        "SELECT d.*, u.username FROM documents d LEFT JOIN users u ON d.user_id = u.id WHERE d.id = $1",
        [id]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  // Получить документы конкретного пользователя
  static async getByUserId(userId) {
    try {
      const result = await db.query(
        "SELECT * FROM documents WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
      );
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  // Создать новый документ
  static async create(documentData) {
    try {
      const { title, description, file_path, user_id } = documentData;
      const result = await db.query(
        "INSERT INTO documents (title, description, file_path, user_id) VALUES ($1, $2, $3, $4) RETURNING id",
        [title, description, file_path, user_id]
      );
      return result.rows[0].id;
    } catch (err) {
      throw err;
    }
  }

  // Обновить документ
  static async update(id, documentData) {
    try {
      const { title, description, file_path } = documentData;
      const result = await db.query(
        "UPDATE documents SET title = $1, description = $2, file_path = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4",
        [title, description, file_path, id]
      );
      return result.rowCount > 0;
    } catch (err) {
      throw err;
    }
  }

  // Удалить документ
  static async delete(id) {
    try {
      const result = await db.query("DELETE FROM documents WHERE id = $1", [
        id,
      ]);
      return result.rowCount > 0;
    } catch (err) {
      throw err;
    }
  }

  // Поиск документов
  static async search(query) {
    try {
      const result = await db.query(
        "SELECT d.*, u.username FROM documents d LEFT JOIN users u ON d.user_id = u.id WHERE d.title ILIKE $1 OR d.description ILIKE $1 ORDER BY d.created_at DESC",
        [`%${query}%`]
      );
      return result.rows;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Document;
