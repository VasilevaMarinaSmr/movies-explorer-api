const router = require('express').Router();
const { validationСreateMovie, validationDeleteMovie } = require('../middlewares/celebrate');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);
router.post('/movies', validationСreateMovie, createMovie);
router.delete('/movies/:movieId', validationDeleteMovie, deleteMovie);

module.exports = router;
