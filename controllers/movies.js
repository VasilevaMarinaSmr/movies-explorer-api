const Movie = require('../models/movie');
const ErrorRequest = require('../errors/error-request');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');


module.exports.getMovies = (req, res, next) => {
    const id = req.user._id;
    Movie.find({ owner: id })
      .then((mov) =>  res.status(200).send(mov))
      .catch(next);
  };


module.exports.createMovie = (req, res, next) => {
    const {
      country, director, duration, year, description, image, trailer,
      thumbnail, movieId, nameRU, nameEN, } = req.body;
  
    Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      thumbnail,
      owner: req.user._id,
      movieId,
      nameRU,
      nameEN,
    })
      .then((mov) => res.send(mov))
      .catch((err) => {
        if (err.name === 'ValidationError') {
            next(new ErrorRequest('Переданы некорректные данные'));
        }
        next(err);
      })
    };
  
  module.exports.deleteMovie = (req, res, next) => {
    const { movieId } = req.params;

    Movie.findById(movieId)
      .then((mov) => {
        if (!mov) {
          throw new NotFoundError('Фильм с указанным id не найден');
        }
        if (mov.owner.toString() !== req.user._id) {
          throw new ForbiddenError('Вы можете удалять только свои фильмы');
        } else {
          Movie.findByIdAndRemove(movieId)
            .then(() => res.status(200).send({ message: 'Фильм удалён' }));
        }
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          next(new ErrorRequest('Переданы некорректные данные'));
        } else {
          next(err);
        }
      });
  };
