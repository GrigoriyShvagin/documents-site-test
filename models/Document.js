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
      const {
        title,
        description,
        content,
        file_path,
        file_name,
        file_size,
        file_type,
        user_id,
      } = documentData;
      const result = await db.query(
        `INSERT INTO documents 
        (title, description, content, file_path, file_name, file_size, file_type, user_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING id`,
        [
          title,
          description,
          content,
          file_path,
          file_name,
          file_size,
          file_type,
          user_id,
        ]
      );
      return result.rows[0].id;
    } catch (err) {
      throw err;
    }
  }

  // Обновить документ
  static async update(id, documentData) {
    try {
      const {
        title,
        description,
        content,
        file_path,
        file_name,
        file_size,
        file_type,
      } = documentData;
      let query = "UPDATE documents SET title = $1, description = $2";
      let params = [title, description];
      let paramCount = 3;

      // Добавляем контент, если он предоставлен
      if (content !== undefined) {
        query += `, content = $${paramCount}`;
        params.push(content);
        paramCount++;
      }

      // Добавляем информацию о файле, если она предоставлена
      if (file_path !== undefined) {
        query += `, file_path = $${paramCount}`;
        params.push(file_path);
        paramCount++;

        if (file_name !== undefined) {
          query += `, file_name = $${paramCount}`;
          params.push(file_name);
          paramCount++;
        }

        if (file_size !== undefined) {
          query += `, file_size = $${paramCount}`;
          params.push(file_size);
          paramCount++;
        }

        if (file_type !== undefined) {
          query += `, file_type = $${paramCount}`;
          params.push(file_type);
          paramCount++;
        }
      }

      // Добавляем updated_at и id
      query += `, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount}`;
      params.push(id);

      const result = await db.query(query, params);
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
        "SELECT d.*, u.username FROM documents d LEFT JOIN users u ON d.user_id = u.id WHERE d.title ILIKE $1 OR d.description ILIKE $1 OR d.content ILIKE $1 ORDER BY d.created_at DESC",
        [`%${query}%`]
      );
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  // Получить информацию о типе файла документа
  static getFileInfo(filePath) {
    if (!filePath) return null;

    const parsedPath = filePath.split("/").pop();
    const extension = parsedPath.split(".").pop().toLowerCase();

    const fileTypes = {
      pdf: { type: "application/pdf", icon: "fa-file-pdf" },
      doc: { type: "application/msword", icon: "fa-file-word" },
      docx: {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        icon: "fa-file-word",
      },
      txt: { type: "text/plain", icon: "fa-file-alt" },
    };

    return (
      fileTypes[extension] || {
        type: "application/octet-stream",
        icon: "fa-file",
      }
    );
  }

  // Поиск документов пользователя
  static async searchByUserId(query, userId) {
    try {
      const result = await db.query(
        "SELECT d.*, u.username FROM documents d LEFT JOIN users u ON d.user_id = u.id WHERE (d.title ILIKE $1 OR d.description ILIKE $1 OR d.content ILIKE $1) AND d.user_id = $2 ORDER BY d.created_at DESC",
        [`%${query}%`, userId]
      );
      return result.rows;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Document;
