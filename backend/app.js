require('dotenv').config();
const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const errorsHandler = require('./modules/errorsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { login, createUser } = require('./controllers/users');

const NotFoundError = require('./errors/not-found-err');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(requestLogger);
app.use(limiter);
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://localhost:3000',
      'http://localhost:3001',
      'https://localhost:3001',
      'http://meniaylo.nomoredomains.sbs',
      'https://meniaylo.nomoredomains.sbs',
    ],
    credentials: true,
  }),
);

app.use(cookieParser());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().pattern('/^(https?:\/\/)?([\w.]+)\.([a-z]{2,6}\.?)(\/[\w.]*)*\/?$/'),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.get('/signout', (_req, res) => {
  res.clearCookie('jwt').send({ message: 'Вы вышли из приложения, и мы уже скучаем!' });
});

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('*', (_req, _res, next) => {
  next(new NotFoundError('Not Found'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorsHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening port ${PORT}`);
});
