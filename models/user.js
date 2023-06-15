const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const ErrorAuthorization = require("../errors/error-authorization");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: "Строк не является адресом электронной",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new ErrorAuthorization("Неправильные почта или пароль");
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new ErrorAuthorization("Неправильные почта или пароль")
          );
        }
        return user; // теперь user доступен
      });
    });
};

module.exports = mongoose.model("user", userSchema);
