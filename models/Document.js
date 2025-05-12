const db = require("../config/database");

class Document {
  // Получить все документы
  static getAll() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM documents";

      db.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  // Получить документ по ID
  static getById(id) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM documents WHERE id = ?";

      db.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0]);
      });
    });
  }

  // Получить документы конкретного пользователя
  static getByUserId(userId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM documents WHERE user_id = ?";

      db.query(query, [userId], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  // Создать новый документ
  static create(documentData) {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO documents SET ?";

      db.query(query, documentData, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.insertId);
      });
    });
  }

  // Обновить документ
  static update(id, documentData) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE documents SET ? WHERE id = ?";

      db.query(query, [documentData, id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.affectedRows > 0);
      });
    });
  }

  // Удалить документ
  static delete(id) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM documents WHERE id = ?";

      db.query(query, [id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.affectedRows > 0);
      });
    });
  }
}

module.exports = Document;
