const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middleware/auth');
const uploadMiddleware = require('../../middleware/upload');
const { users: controller } = require('../../controllers');
module.exports = router;

// router.post('/signup', uploadMiddleware.single('avatarURL'), controller.signup);

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.patch(
  '/avatars',
  authMiddleware,
  uploadMiddleware.single('avatarURL'),
  controller.updateAvatar,
);
router.get('/logout', authMiddleware, controller.logout);
router.get('/current', authMiddleware, controller.getUserData);
