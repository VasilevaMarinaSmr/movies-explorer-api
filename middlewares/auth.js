const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const ErrorAuthorization = require('../errors/error-authorization');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new ErrorAuthorization('Требуется авторизация'));
    return;
  }
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    next(new ErrorAuthorization('Неверный логин или пароль'));
    return;
  }
  req.user = payload;
  next();
};
