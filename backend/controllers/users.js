require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const DataError = require('../errors/data-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неверный email или пароль');
      }

      return bcrypt.compare(password, user.password)
        // eslint-disable-next-line consistent-return
        .then((isValid) => {
          if (!isValid) {
            throw new UnauthorizedError('Неверный email или пароль');
          }

          if (isValid) {
            const token = jwt.sign(
              { _id: user._id },
              NODE_ENV === 'production' ? JWT_SECRET : 'SECRET_KEY',
              { expiresIn: '7d' },
            );

            return res
              .cookie('jwt', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/',
                // sameSite: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
              })
              .status(200)
              .send({
                name: user.name,
                about: user.about,
                avatar: user.avatar,
                email: user.email,
                id: user._id,
              });
          }
        });
    })
    .catch(next);
};

const usersController = (_req, res, next) => {
  User.find()
    .then((users) => res.send(users))
    .catch(next);
};

const userController = (req, res, next) => {
  const { userId } = req.params;
  User.findOne({ _id: userId })
    .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataError('Введите корректные данные'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError('Введите корректные данные'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

const getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findOne({ _id: userId })
    .orFail(() => new NotFoundError('Пользователь по указанному _id не найден'))
    .then((data) => {
      res.send(data);
    })
    .catch((err) => next(err))
    .catch(next);
};

const updateUserProfile = (req, res, next) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError('Переданы некорректные данные при обновлении профиля'));
      } else if (err.statusCode === 404) {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      } else {
        next(err);
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError('Переданы некорректные данные при обновлении аватара'));
      } else if (err.statusCode === 404) {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  userController,
  usersController,
  createUser,
  getUserInfo,
  updateUserProfile,
  updateUserAvatar,
  login,
};
