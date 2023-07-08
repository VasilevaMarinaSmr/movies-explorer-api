const router = require('express').Router();
const { createUser, login, logout } = require('../controllers/users');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { validationLogin, validationCreateUser } = require('../middlewares/celebrate');
const { auth } = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-error');

router.post('/signup', validationCreateUser, createUser);
router.post('/signin', validationLogin, login);
router.post('/signout', logout);

router.use(auth);
router.use('/', userRouter);
router.use('/', movieRouter);
router.all('*', () => {
  throw new NotFoundError('Cтраница не существует');
});

module.exports = router;
