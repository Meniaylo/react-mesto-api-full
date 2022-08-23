const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-err');
const DataError = require('../errors/data-err');
const ForbiddenError = require('../errors/forbidden-err');

const cardsController = (_req, res, next) => {
  Card.find().sort({ _id: -1 })
    .then((data) => res.send(data))
    .catch((err) => next(err))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findOne({ _id: req.params.cardId })
    .orFail(() => new NotFoundError('Карточка c указанным _id не найдена'))
    .then((card) => {
      if (String(card.owner) === req.user._id) {
        return card.remove()
          .then(() => res.send({ message: 'Карточка удалена' }))
          .catch(next);
      }
      throw new ForbiddenError('Не ты порождал - не тебе и убивать!');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataError('Введите корректные данные'));
      } else {
        next(err);
      }
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError('Введите корректные данные'));
      } else {
        next(err);
      }
    });
};

const putCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataError('Переданы некорректные данные для постановки лайка'));
      } else {
        next(err);
      }
    });
};

const deleteCardLike = (req, res, next) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: _id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataError('Переданы некорректные данные для снятия лайка'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  cardsController,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
};
