const router = require('express').Router();
const { validationUpdateProfile } = require('../middlewares/celebrate');

const {
  getCurrentUser,
  updateProfile,
} = require('../controllers/users');

router.get('/users/me', getCurrentUser);
router.patch('/users/me', validationUpdateProfile, updateProfile);

module.exports = router;