require('dotenv').config();
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const UnauthorizedError = require('../errors/unauthorized-err');

const auth = (req, _res, next) => {
  const { cookies } = req;

  if (!cookies.jwt) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  const token = cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'SECRET_KEY');
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  req.user = payload;

  next();
};

module.exports = auth;
