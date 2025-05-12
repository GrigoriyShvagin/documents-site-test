// Здесь будут middleware функции
// Пример:
/*
exports.logger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
};

exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Ошибка',
    message: 'Что-то пошло не так!' 
  });
};
*/
