const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Настройка хранилища для загрузки файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../public/uploads");
    // Проверяем существование директории
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // Сохраняем оригинальное расширение файла
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

// Фильтр для файлов
const fileFilter = (req, file, cb) => {
  // Принимаем только PDF файлы и популярные форматы документов
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/msword" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Недопустимый формат файла. Разрешены только PDF, DOC, DOCX"),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Лимит 10MB
  },
});

module.exports = upload;
