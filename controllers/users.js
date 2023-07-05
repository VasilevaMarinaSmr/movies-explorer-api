const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const ErrorRequest = require('../errors/error-request');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');

const { NODE_ENV, JWT_SECRET } = process.env;

function getCurrentUser(req, res, next) {
    User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      return res.send(user);
    })
    .catch(next);
};

function updateProfile(req, res, next) {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorRequest('Переданы некорректные данные при обновлении профиля.'));
      } else {
        next(err);
      }
    });
};
 
function createUser(req, res, next) {
  const {
    name, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        email,
        password: hash,
      })
    )
    .then((user) => {res.status(201).send({
          name: user.name,
          email: user.email,
        });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new ErrorRequest('Переданы некорректные данные при создании пользователя.'));
          return;
        }
        if (err.code === 11000) {
          next(new ConflictError('Пользователь с таким email уже существует'));
        } else {
          next(err);
        }
      });
}

function login(req, res, next) {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((validUser) => {
      const token = jwt.sign(
        { _id: validUser._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' }
      );

      User.findOne({ email }).then((user) =>
        res
          .cookie('jwt', token, {
            httpOnly: true,
            sameSite: true,
            maxAge: 360000 * 24 * 7,
          })
          .send(user)
      );
    })
    .catch(next);
}
const logout = (req, res) =>
  res
    .clearCookie('jwt', { httpOnly: true, sameSite: true })
    .send({ message: 'Выход выполнен' });

module.exports = {
  getCurrentUser,
  updateProfile,
  createUser,
  login,
  logout,
};