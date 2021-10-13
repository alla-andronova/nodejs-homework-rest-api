const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middleware/auth');
const { users: controller } = require('../../controllers');
module.exports = router;

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.get('/logout', authMiddleware, controller.logout);
router.get('/current', authMiddleware, controller.getUserData);
