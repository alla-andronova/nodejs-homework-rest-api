const express = require('express');
const router = express.Router();

const { users: controller } = require('../../controllers');
module.exports = router;

router.post('/signup', controller.signup);
// router.post('./login', controller.login);
// router.get('./logout', controller.logout);
