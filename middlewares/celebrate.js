const { Joi, celebrate } = require('celebrate');
const { ObjectId } = require('mongoose').Types;


module.exports.validationLogin = celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  });

  module.exports.validationCreateUser = celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  });

  module.exports.validationUpdateProfile = celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  });

  module.exports.validationСreateMovie = celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().uri(),
      trailer: Joi.string().required().uri(),
      thumbnail: Joi.string().required().uri(),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  });


  module.exports.validationDeleteMovie = celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().hex().length(24),
    }),
  });
