require('dotenv').config();

const { errors } = require('celebrate');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');
const { errorServer } = require('./middlewares/errorServer');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const corsconf = require('./middlewares/corsconf');
const limiter = require('./middlewares/ratelimit');

const { PORT = 3000, MONGODB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log('Успешное соединение с базой данных');
  })
  .catch((err) => {
    console.log(`Ошибка соединения с базой данных ${err}`);
  });

const app = express();
app.use(corsconf);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use('/', router);
app.use(errorLogger);
app.use(errors());
app.use(errorServer);
app.listen(PORT, () => {
  console.log(`Слушаем порт ${PORT}`);
});
