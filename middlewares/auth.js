// Проверка авторизации
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  next();
};

// Проверка роли администратора
const requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).render("error", {
      title: "Доступ запрещен",
      message: "У вас нет прав для доступа к этой странице",
    });
  }
  next();
};

// Проверка роли поддержки
const requireSupport = (req, res, next) => {
  if (
    !req.session.user ||
    (req.session.user.role !== "support" && req.session.user.role !== "admin")
  ) {
    return res.status(403).render("error", {
      title: "Доступ запрещен",
      message: "У вас нет прав для доступа к этой странице",
    });
  }
  next();
};

// Проверка владельца документа или админа
const requireOwnerOrAdmin = async (req, res, next) => {
  const Document = require("../models/Document");

  try {
    const document = await Document.getById(req.params.id);
    if (!document) {
      return res.status(404).render("error", {
        title: "Не найдено",
        message: "Документ не найден",
      });
    }

    if (
      req.session.user.role === "admin" ||
      document.user_id === req.session.user.id
    ) {
      req.document = document;
      next();
    } else {
      return res.status(403).render("error", {
        title: "Доступ запрещен",
        message: "Вы можете редактировать только свои документы",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).render("error", {
      title: "Ошибка сервера",
      message: "Произошла ошибка при проверке прав доступа",
    });
  }
};

module.exports = {
  requireAuth,
  requireAdmin,
  requireSupport,
  requireOwnerOrAdmin,
};
